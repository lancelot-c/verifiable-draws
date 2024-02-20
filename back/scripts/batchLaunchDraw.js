import fs from 'fs'
import hardhat from 'hardhat';
import crypto from 'crypto'
const { WALLET_PRIVATE_KEY, TESTNET_CONTRACT_ADDRESS, MAINNET_CONTRACT_ADDRESS } = process.env;
const network = hardhat.network.name;
const contractAddress = (network == 'mainnet') ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync(`./contracts/abi.json`)).abi;
const provider = new hardhat.ethers.Wallet(WALLET_PRIVATE_KEY, hardhat.ethers.provider);
const contract = new hardhat.ethers.Contract(
    contractAddress,
    abi,
    provider
);
console.log(`Smart contract address ${contractAddress} on network ${network}`);

async function main() {

    // The draws you want to deploy
    const draws = [
        {
            nbParticipants: 5000,
            nbWinners: 9
        },
        {
            nbParticipants: 10,
            nbWinners: 1
        },
        {
            nbParticipants: 9538,
            nbWinners: 57
        },
        {
            nbParticipants: 94567,
            nbWinners: 3
        },
        {
            nbParticipants: 24594,
            nbWinners: 99
        },
        {
            nbParticipants: 134,
            nbWinners: 100
        },
        {
            nbParticipants: 53498,
            nbWinners: 50
        },
        {
            nbParticipants: 3475,
            nbWinners: 6
        },
        {
            nbParticipants: 245,
            nbWinners: 10
        },
        {
            nbParticipants: 493,
            nbWinners: 20
        },
    ];

    // Batch init
    let cidArray = [];
    let scheduledAtArray = [];
    let nbParticipantsArray = [];
    let nbWinnersArray = [];
    let batchWinnersCount = 0;
    let batchCount = 1;
    let nbParticipants;
    let nbWinners;

    // Launch all the draws
    for (let i = 0; i < draws.length; i++) {

        nbParticipants = draws[i].nbParticipants;
        nbWinners = draws[i].nbWinners;

        if (nbWinners > nbParticipants) {
            throw Error(`draws[${i}] has ${nbWinners} winners but only ${nbParticipants} participants`);
        }

        if (nbWinners < 1) {
            throw Error(`draws[${i}] has ${nbWinners} winners but the minimum allowed is 1.`);
        }


        // Add draw to the batch
        const cid = generateRandomCid();
        cidArray.push(cid);
        scheduledAtArray.push(1706006516); // Past timestamp in order to trigger the draw right away
        nbParticipantsArray.push(nbParticipants);
        nbWinnersArray.push(nbWinners);
        batchWinnersCount += nbWinners;
        console.log(`Batch ${batchCount} - Add draws[${i}]: CID ${cid}, ${nbParticipants} participants, ${nbWinners} winners`);        
    }

    const batchSize = cidArray.length;
    console.log(`Batch ${batchCount} - Launch ${batchSize} draws\n`);
            
    try {

        const batchLaunchDraw = await contract.batchLaunchDraw(batchSize, cidArray, scheduledAtArray, nbParticipantsArray, nbWinnersArray);
        await batchLaunchDraw.wait();

    } catch (err) {
        console.error(err);
    }
}


function generateRandomCid() {
    return crypto.randomUUID();
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    });
