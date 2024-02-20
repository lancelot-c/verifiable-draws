// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.23;

import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol"; // ChainLink Automation
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol"; // ChainLink VRF
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol"; // ChainLink VRF
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol"; // Ownership

/**
 * @title Random.win Smart Contract
 * @author Lancelot Chardonnet
 *
 * @notice This contract allows you to create decentralized random draws
 * 
 */
contract RandomWin is AutomationCompatibleInterface, VRFConsumerBaseV2, ConfirmedOwner {

    /*** Errors ***/

    error DrawAlreadyExists(string cid);
    error DrawDoesNotExist(string cid);
    error DrawTooEarly(string cid);
    error DrawAlreadyTriggered(string cid);
    error DrawAlreadyCompleted(string cid);
    error NoEntropyNeeded(string[] cids);
    error RequestDoesNotExist(uint256 id);
    error RequestAlreadyFulfilled(uint256 id);
    error RandomnessFulfilledButEmpty(uint256 id);


    /*** Events ***/

    event DrawLaunched(string cid, uint64 publishedAt, uint64 scheduledAt, uint32 entropyNeeded);
    event RandomnessRequested(
        uint256 requestId,
        string[] cids,
        uint32 numWords,
        bytes32 keyHash,
        uint64 s_subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit
    );
    event RandomnessFulfilled(uint256 requestId, uint256[] randomWords);
    event DrawsCompleted(string[] cids);


    /*** Draws ***/

    struct Draw {
        uint64 publishedAt; // block number at which the draw was published on the contract
        uint64 scheduledAt; // timestamp at which the draw should be triggered
        uint256 occuredAt; // block number at which the draw has occurred
        uint32 nbParticipants; // number of participants
        uint32 nbWinners; // number of winners to select for this draw
        uint32 entropyNeeded; // number of bytes of information needed to compute winners
        bytes entropy; // entropy used to pick winners
        bool entropyPending; // when the random numbers are being generated
        bool completed; // when the draw is done and entropy as been filled
    }
   
    mapping(string => Draw) private draws; // Content Identifier (CID) => Draw
    string[] private queue; // draws for which completed = false
    uint32 private drawCount = 0;


    /*** Requests ***/

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256 createdAt; // block timestamp
        uint256[] randomWords;
        string[] cids;
    }

    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */
    uint256[] private pendingRequests;


    /*** VRF ***/
    
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 private s_subscriptionId;

    // See https://docs.chain.link/docs/vrf-contracts/#configurations
    address link_token_contract = 0xb0897686c545045aFc77CF20eC7A532E3120E0F1;
    address vrfCoordinator = 0xAE975071Be8F8eE67addBC1A82488F1C24858067;
    bytes32 keyHash = 0xd729dc84e21ae57ffb6be0053bf2b0668aa2aaf300a2a7b2ddf7dc0bb6e875a8;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;


    constructor (
        uint64 subscriptionId
    )
        VRFConsumerBaseV2(vrfCoordinator)
        ConfirmedOwner(msg.sender)
    {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }


    function launchDraw(
        string memory cid,
        uint64 scheduledAt,
        uint32 nbParticipants,
        uint32 nbWinners,
        uint32 entropyNeeded
    )
        external
        onlyOwner
    {
        if (draws[cid].publishedAt != 0) {
            revert DrawAlreadyExists(cid);
        }

        uint64 publishedAt = uint64(block.number);
        uint256 occuredAt = 0;
        bytes memory entropy = "";
        draws[cid] = Draw(publishedAt, scheduledAt, occuredAt, nbParticipants, nbWinners, entropyNeeded, entropy, false, false);
        queue.push(cid);
        drawCount++;
        emit DrawLaunched(cid, publishedAt, scheduledAt, entropyNeeded);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = false;
        bool[] memory isReady = new bool[](queue.length);
        uint32 count = 0;

        for (uint64 i = 0; i < queue.length; i++) {

            string memory cid = queue[i];

            // Conditions needed in order to trigger a draw
            if (draws[cid].publishedAt > 0 && block.timestamp >= draws[cid].scheduledAt && !draws[cid].entropyPending && !draws[cid].completed) {
                upkeepNeeded = true;
                isReady[i] = true;
                count++;
            }
        }

        if (upkeepNeeded) {
            uint32 j = 0;
            uint32[] memory queueIdx = new uint32[](count);
            for (uint32 i = 0; i < isReady.length; i++) {
                if (isReady[i]) {
                    queueIdx[j] = i;
                    j++;
                }
            }
            performData = abi.encode(queueIdx);
        }

        return (upkeepNeeded, performData);
    }


    function performUpkeep(
        bytes calldata performData
    )
        external
        override
    {
        uint32[] memory queueIdx = abi.decode(performData, (uint32[]));
        string[] memory requestedCids = new string[](queueIdx.length);
        uint32 totalEntropyNeeded = 0;

        // We revalidate the draws in the performUpkeep to prevent malicious actors
        // from calling performUpkeep with wrong parameters 
        for (uint64 i = 0; i < queueIdx.length; i++) {

            string memory cid = queue[queueIdx[i]];
            requestedCids[i] = cid;
            
            if (draws[cid].publishedAt == 0) {
                revert DrawDoesNotExist(cid);
            }

            if (block.timestamp < draws[cid].scheduledAt) {
                revert DrawTooEarly(cid);
            }

            if (draws[cid].entropyPending) {
                revert DrawAlreadyTriggered(cid);
            }

            if (draws[cid].completed) {
                revert DrawAlreadyCompleted(cid);
            }

            draws[cid].entropyPending = true;
            totalEntropyNeeded += draws[cid].entropyNeeded;
        }

        if (totalEntropyNeeded == 0) {
            revert NoEntropyNeeded(requestedCids);
        }

        removeIndexesFromArray(queue, queueIdx);
        generateEntropyFor(requestedCids, totalEntropyNeeded);
    }

    function generateEntropyFor(string[] memory requestedCids, uint32 totalEntropyNeeded)
        private
    {
 
        // Each word gives an entropy of 256 bits, i.e. 32 bytes
        uint32 numWords = divisionRoundUp(totalEntropyNeeded, 32);

        // Will revert if subscription is not set and funded.
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );

        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            cids: requestedCids,
            fulfilled: false,
            createdAt: block.timestamp
        });

        pendingRequests.push(requestId);

        emit RandomnessRequested(
            requestId,
            requestedCids,
            numWords,
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit
        );
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        RequestStatus memory request = s_requests[_requestId];

        if (request.createdAt == 0) {
            revert RequestDoesNotExist(_requestId);
        }

        if (request.fulfilled) {
            revert RequestAlreadyFulfilled(_requestId);
        }

        if (_randomWords.length == 0) {
            revert RandomnessFulfilledButEmpty(_requestId);
        }

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        for (uint256 i = 0; i < pendingRequests.length; i++) {
            if (pendingRequests[i] == _requestId) {
                if (i != pendingRequests.length - 1) {
                    pendingRequests[i] = pendingRequests[pendingRequests.length - 1];
                }
                
                pendingRequests.pop();
                break;
            }
        }
        emit RandomnessFulfilled(_requestId, _randomWords);

        bytes memory totalEntropy = abi.encodePacked(_randomWords);
        uint32 from = 0;
        uint32 bytesNeeded = 0;

        for (uint64 i = 0; i < request.cids.length; i++) {
            string memory cid = request.cids[i];

            if (!draws[cid].completed) {
                bytesNeeded = draws[cid].entropyNeeded;
                draws[cid].entropy = extractBytes(totalEntropy, from, bytesNeeded);
                draws[cid].occuredAt = block.number;
                draws[cid].entropyPending = false;
                draws[cid].completed = true;
                from += bytesNeeded;
            } else {
                revert DrawAlreadyCompleted(cid);
            }
        }

        emit DrawsCompleted(request.cids);
    }


    /*** Getters ***/

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256[] memory randomWords) {

        RequestStatus memory request = s_requests[_requestId];

        if (request.createdAt == 0) {
            revert RequestDoesNotExist(_requestId);
        }

        return (request.fulfilled, request.randomWords);
    }

    function getDrawCount() external view onlyOwner returns (uint32) {
        return drawCount;
    }

    function getDrawDetails(string memory cid) external view returns (Draw memory) {
        return draws[cid];
    }

    function getRandomnessForDraw(string memory cid) external view returns (bytes memory) {
        return draws[cid].entropy;
    }

    function checkContestWinners(string memory contest_identifier) external view returns (uint32[] memory) {

        bytes memory totalEntropy = draws[contest_identifier].entropy;
        require(totalEntropy.length != 0, "The draw has not occured yet. Come back later.");

        uint32 nbWinners = draws[contest_identifier].nbWinners;
        uint32 nbParticipants = draws[contest_identifier].nbParticipants;
        uint32[] memory winnerIndexes = new uint32[](nbWinners); // Fixed sized array, all elements initialize to 0
        uint32 from = 0;

        for (uint32 i = 0; i < nbWinners; i++) {

            uint32 nbBytesNeeded = divisionRoundUp(uint32(log2(nbParticipants - i)), 8);
            bytes memory extractedEntropy = extractBytes(totalEntropy, from, nbBytesNeeded);
            from += nbBytesNeeded;

            uint32 randomNumber = uint32(bytesToUint(extractedEntropy));
            randomNumber = randomNumber % (nbParticipants - i);
            uint32 tempIndex = randomNumber;
            uint32 min = 0;

            while (true) {
                uint32 offset = nbValuesBetween(winnerIndexes, min, tempIndex, i);
                if (offset == 0) {
                    break;
                }
                min = tempIndex + 1;
                tempIndex += offset;
            }

            winnerIndexes[i] = tempIndex;
        }

        // We want to display line numbers, not indexes, so all indexes need to be +1
        for (uint32 i = 0; i < nbWinners; i++) {
            winnerIndexes[i] += 1;
        }

        return winnerIndexes;
    }

    function getQueue() external view onlyOwner returns (string[] memory) {
        return queue;
    }


    /*** Setters ***/

    function setSubscription(uint64 subscriptionId) external onlyOwner {
        s_subscriptionId = subscriptionId;
    }


    /*** Utils ***/

    // Division rounds down by default in Solidity, this function rounds up
    function divisionRoundUp(uint32 a, uint32 m) private pure returns (uint32) {
        return (a + m - 1) / m;
    }

    function extractBytes(bytes memory data, uint32 from, uint32 n) private pure returns (bytes memory) {
        
        require(data.length >= from + n, "Slice out of bounds");
        
        bytes memory returnValue = new bytes(n);
        for (uint32 i = 0; i < n; i++) {
            returnValue[i] = data[from + i]; 
        }
        return returnValue;
    }

    // See https://ethereum.stackexchange.com/a/51234
    function bytesToUint(bytes memory b) internal pure returns (uint256) {
        uint256 number;
        for(uint i = 0; i < b.length; i++){
            number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
        }
        return number;
    }

    function nbValuesBetween(uint32[] memory arr, uint32 min, uint32 max, uint32 imax) internal pure returns (uint32) {
        uint32 count = 0;

        for (uint32 i = 0; i < imax; i++) {
            if (arr[i] >= min && arr[i] <= max) {
                count++;
            }
        }

        return count;
    }

    // See https://ethereum.stackexchange.com/a/30168
    function log2(uint256 x) internal pure returns (uint256 y) {
        assembly {
            let arg := x
            x := sub(x,1)
            x := or(x, div(x, 0x02))
            x := or(x, div(x, 0x04))
            x := or(x, div(x, 0x10))
            x := or(x, div(x, 0x100))
            x := or(x, div(x, 0x10000))
            x := or(x, div(x, 0x100000000))
            x := or(x, div(x, 0x10000000000000000))
            x := or(x, div(x, 0x100000000000000000000000000000000))
            x := add(x, 1)
            let m := mload(0x40)
            mstore(m,           0xf8f9cbfae6cc78fbefe7cdc3a1793dfcf4f0e8bbd8cec470b6a28a7a5a3e1efd)
            mstore(add(m,0x20), 0xf5ecf1b3e9debc68e1d9cfabc5997135bfb7a7a3938b7b606b5b4b3f2f1f0ffe)
            mstore(add(m,0x40), 0xf6e4ed9ff2d6b458eadcdf97bd91692de2d4da8fd2d0ac50c6ae9a8272523616)
            mstore(add(m,0x60), 0xc8c0b887b0a8a4489c948c7f847c6125746c645c544c444038302820181008ff)
            mstore(add(m,0x80), 0xf7cae577eec2a03cf3bad76fb589591debb2dd67e0aa9834bea6925f6a4a2e0e)
            mstore(add(m,0xa0), 0xe39ed557db96902cd38ed14fad815115c786af479b7e83247363534337271707)
            mstore(add(m,0xc0), 0xc976c13bb96e881cb166a933a55e490d9d56952b8d4e801485467d2362422606)
            mstore(add(m,0xe0), 0x753a6d1b65325d0c552a4d1345224105391a310b29122104190a110309020100)
            mstore(0x40, add(m, 0x100))
            let magic := 0x818283848586878898a8b8c8d8e8f929395969799a9b9d9e9faaeb6bedeeff
            let shift := 0x100000000000000000000000000000000000000000000000000000000000000
            let a := div(mul(x, magic), shift)
            y := div(mload(add(m,sub(255,a))), shift)
            y := add(y, mul(256, gt(arg, 0x8000000000000000000000000000000000000000000000000000000000000000)))
        }  
    }

    // idx must be sorted in ascending order
    function removeIndexesFromArray(string[] storage arr, uint32[] memory idx) internal {

        uint32 previous = idx[0];
        for (uint32 i = 1; i < idx.length; i++) {
            if (previous < idx[i]) {
                previous = idx[i];
            } else {
                revert("Indexes must be sorted");
            }
        }
        require(idx[idx.length - 1] < arr.length, "Index to remove out of bound");

        uint32 stopAtIndex = uint32(arr.length - idx.length);
        uint32 indexToMove = uint32(arr.length);
        uint32 j = 0;

        for (uint32 i = 0; i < idx.length; i++) {

            if (idx[i] >= stopAtIndex) {
                break;
            }

            indexToMove--;

            while (j < idx.length) {
                uint32 indexToRemove = idx[idx.length-j-1];

                if (indexToRemove == indexToMove) {
                    indexToMove--;
                } else {
                    break;
                }

                j++;
            }

            arr[idx[i]] = arr[indexToMove];
        }

        for (uint32 i = 0; i < idx.length; i++) {
            arr.pop();
        }
    }

}