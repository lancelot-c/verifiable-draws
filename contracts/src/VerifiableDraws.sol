// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.8.23;

import "chainlink/src/v0.8/automation/AutomationCompatible.sol"; // ChainLink Automation
import "chainlink/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol"; // ChainLink VRF
import "chainlink/src/v0.8/vrf/VRFConsumerBaseV2.sol"; // ChainLink VRF
import "chainlink/src/v0.8/shared/access/ConfirmedOwner.sol"; // Ownership

/**
 * @title Verifiable Draws Smart Contract
 * @author Lancelot Chardonnet
 *
 * @notice This contract allows you to create decentralized random draws
 * 
 */
contract VerifiableDraws is AutomationCompatibleInterface, VRFConsumerBaseV2, ConfirmedOwner {

    /*** Errors ***/

    error DrawAlreadyExists(string cid);
    error DrawDoesNotExist(string cid);
    error DrawTooEarly(string cid);
    error RequestAlreadyPending(string cid);
    error DrawAlreadyCompleted(string cid);
    error RequestDoesNotExist(uint256 id);
    error RequestAlreadyFulfilled(uint256 id);
    error RandomnessFulfilledButEmpty(uint256 id);


    /*** Events ***/

    event DrawLaunched(string cid, uint64 publishedAt, uint64 scheduledAt, uint32 entropyNeeded);
    event DrawLaunchedBatch(string[] cids);
    event RandomnessRequested(
        uint256 requestId,
        string cid,
        uint32 numWords,
        bytes32 keyHash,
        uint64 s_subscriptionId,
        uint16 requestConfirmations,
        uint32 callbackGasLimit
    );
    event RandomnessFulfilled(uint256 requestId, uint256[] randomWords);
    event DrawCompleted(string cid);


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
    uint32 private entropyNeededPerWinner = 8; // Retrieving 8 bytes (64 bits) of entropy for each winner is enough to have an infinitely small scaling bias


    /*** Requests ***/

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256 createdAt; // block timestamp
        uint256[] randomWords;
        string cid;
    }

    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */


    /*** VRF ***/
    
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 private s_subscriptionId;

    // See https://docs.chain.link/vrf/v2/subscription/supported-networks
    address link_token_contract = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;
    address vrfCoordinator = 0x50d47e4142598E3411aA864e08a44284e471AC6f;
    bytes32 keyHash = 0x027f94ff1465b3525f9fc03e9ff7d6d2c0953482246dd6ae07570c45d6631414;
    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 1;

    // Maximum number of words that can be received with fulfillRandomWords before reaching the gas limit
    uint32 public constant MAX_NUM_WORDS = 43;


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
        uint32 nbWinners
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
        uint32 entropyNeeded = computeEntropyNeeded(nbWinners);
        draws[cid] = Draw(publishedAt, scheduledAt, occuredAt, nbParticipants, nbWinners, entropyNeeded, entropy, false, false);
        drawCount++;

        emit DrawLaunched(cid, publishedAt, scheduledAt, entropyNeeded);

        if (block.timestamp >= scheduledAt) {
            string[] memory cids = new string[](1);
            cids[0] = cid;
            generateEntropyFor(cids);
        } else {
            queue.push(cid);
        }
        
    }

    function batchLaunchDraw(
        uint32 batchSize,
        string[] memory cidArray,
        uint64[] memory scheduledAtArray,
        uint32[] memory nbParticipantsArray,
        uint32[] memory nbWinnersArray
    )
        external
        onlyOwner
    {

        bool[] memory isReady = new bool[](batchSize);
        uint32 isReadyCount = 0;

        for (uint32 i = 0; i < batchSize; i++) {

            string memory cid = cidArray[i];
            uint64 scheduledAt = scheduledAtArray[i];
            uint32 nbParticipants = nbParticipantsArray[i];
            uint32 nbWinners = nbWinnersArray[i];
            uint32 entropyNeeded = computeEntropyNeeded(nbWinners);

            if (draws[cid].publishedAt != 0) {
                revert DrawAlreadyExists(cid);
            }

            uint64 publishedAt = uint64(block.number);
            uint256 occuredAt = 0;
            bytes memory entropy = "";
            draws[cid] = Draw(publishedAt, scheduledAt, occuredAt, nbParticipants, nbWinners, entropyNeeded, entropy, false, false);
            drawCount++;

            if (block.timestamp >= scheduledAt) {
                isReady[i] = true;
                isReadyCount++;
            } else {
                queue.push(cid);
            }

        }

        if (isReadyCount > 0) {
            uint32 j = 0;
            string[] memory readyCids = new string[](isReadyCount);

            for (uint32 i = 0; i < batchSize; i++) {
                if (isReady[i]) {
                    readyCids[j] = cidArray[i];
                    j++;
                }
            }

            generateEntropyFor(readyCids);
        }

        emit DrawLaunchedBatch(cidArray);
        
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
                revert RequestAlreadyPending(cid);
            }

            if (draws[cid].completed) {
                revert DrawAlreadyCompleted(cid);
            }

            draws[cid].entropyPending = true;
        }

        removeIndexesFromArray(queue, queueIdx);
        generateEntropyFor(requestedCids);
    }

    function generateEntropyFor(string[] memory requestedCids)
        private
    {

        for (uint32 i = 0; i < requestedCids.length; i++) {

            string memory cid = requestedCids[i];
            uint32 entropyNeeded = draws[cid].entropyNeeded - uint32(draws[cid].entropy.length);

            // Each word gives an entropy of 32 bytes
            uint32 numWordsNeeded = divisionRoundUp(entropyNeeded, 32);
            
            while (numWordsNeeded > 0) {

                uint32 numWords = numWordsNeeded;

                if (numWords > MAX_NUM_WORDS) {
                    numWords = MAX_NUM_WORDS;
                }

                numWordsNeeded -= numWords;
                

                uint256 requestId = COORDINATOR.requestRandomWords(
                    keyHash,
                    s_subscriptionId,
                    requestConfirmations,
                    callbackGasLimit,
                    numWords
                );

                s_requests[requestId] = RequestStatus({
                    randomWords: new uint256[](0),
                    cid: cid,
                    fulfilled: false,
                    createdAt: block.timestamp
                });

                emit RandomnessRequested(
                    requestId,
                    cid,
                    numWords,
                    keyHash,
                    s_subscriptionId,
                    requestConfirmations,
                    callbackGasLimit
                );
            }

        }
 
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        RequestStatus memory request = s_requests[_requestId];
        string memory cid = request.cid;

        if (request.createdAt == 0) {
            revert RequestDoesNotExist(_requestId);
        }

        if (request.fulfilled) {
            revert RequestAlreadyFulfilled(_requestId);
        }

        if (_randomWords.length == 0) {
            revert RandomnessFulfilledButEmpty(_requestId);
        }

        if (draws[cid].completed) {
            revert DrawAlreadyCompleted(cid);
        }

        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RandomnessFulfilled(_requestId, _randomWords);

        bytes memory totalEntropy = abi.encodePacked(_randomWords);

        draws[cid].entropy = extractBytes(totalEntropy, 0, draws[cid].entropyNeeded);
        draws[cid].occuredAt = block.number;
        draws[cid].entropyPending = false;
        draws[cid].completed = true;
        
        emit DrawCompleted(cid);
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

    function checkDrawWinners(string memory draw_identifier) external view returns (uint32[] memory) {

        bytes memory totalEntropy = draws[draw_identifier].entropy;
        require(totalEntropy.length != 0, "The draw has not occured yet. Come back later.");

        uint32 nbWinners = draws[draw_identifier].nbWinners;
        uint32 nbParticipants = draws[draw_identifier].nbParticipants;
        uint32[] memory winnerIndexes = new uint32[](nbWinners); // Fixed sized array, all elements initialize to 0
        uint32 from = 0;

        for (uint32 i = 0; i < nbWinners; i++) {

            bytes8 extractedEntropy = extractBytes8(totalEntropy, from);
            from += entropyNeededPerWinner;

            // When i winners are already selected, we only need a random number between 0 and nbParticipants - i - 1 to select the next winner.
            // ⚠️ Using 64-bit integers for the modulo operation is extremely important to prevent scaling bias ⚠️
            // Then it is fine to convert the result to a 32-bit integer because we know that the output of the modulo will always be stricly less than nbParticipants which is a 32-bit integer
            uint32 randomNumber = uint32(uint64(extractedEntropy) % uint64(nbParticipants - i));
            uint32 nextWinningIndex = randomNumber;
            uint32 min = 0;

            // Once a participant has been selected as a winner, it can never be selected again for that draw.
            // We enforce that by looping over all participants and ignoring those who are already known winners.
            // The offset variable keeps track of how many participants are ignored as we loop through the list and increments the next winning index accordingly.
            // When there is no more participants to ignore (offset == 0), it means we have reached the proper winning index so we break the loop and save this index.
            while (true) {
                uint32 offset = nbValuesBetween(winnerIndexes, min, nextWinningIndex, i);
                if (offset == 0) {
                    break;
                }
                min = nextWinningIndex + 1;
                nextWinningIndex += offset;
            }

            winnerIndexes[i] = nextWinningIndex;
        }

        // We want to display line numbers, not array indexes, so all indexes need to be +1
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


    function computeEntropyNeeded(uint32 nbWinners) private view returns (uint32) {
        return nbWinners * entropyNeededPerWinner;
    }


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

    function extractBytes8(bytes memory data, uint32 from) private pure returns (bytes8) {
        
        require(data.length >= from + 8, "Slice out of bounds");

        return bytes8(bytes.concat(data[from + 0], data[from + 1], data[from + 2], data[from + 3], data[from + 4], data[from + 5], data[from + 6], data[from + 7]));
    }

    // Return the number of values in arr that are between min and max (both included)
    // In Solidity, some arrays must be initialized with a fixed size, then the array is progressively filled with real values during execution
    // When it is the case, you can't loop efficiently through the array with arr.length because it will return the total size of the array, not the size of the filled values
    // That's why we have a length parameter that we use instead of using arr.length, length is the size of the array that is currently in use
    function nbValuesBetween(uint32[] memory arr, uint32 min, uint32 max, uint32 length) internal pure returns (uint32) {
        uint32 count = 0;

        for (uint32 i = 0; i < length; i++) {
            if (arr[i] >= min && arr[i] <= max) {
                count++;
            }
        }

        return count;
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