import fs from 'fs'
import hardhat from 'hardhat';

const { WALLET_PRIVATE_KEY, MAINNET_CONTRACT_ADDRESS, TESTNET_CONTRACT_ADDRESS } = process.env;
const abi = JSON.parse(fs.readFileSync(`./contracts/abi.json`)).abi;
const provider = new hardhat.ethers.Wallet(WALLET_PRIVATE_KEY, hardhat.ethers.provider);
const network = hardhat.network.name;
const contractAddress = (network == 'mainnet') ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;

const contract = new hardhat.ethers.Contract(
    contractAddress,
    abi,
    provider
);


export async function subscribeEvents() {

    console.log(`Smart contract address ${contractAddress} on network ${network}`);

    contract.on("DrawLaunched", (cid, publishedAt, scheduledAt, entropyNeeded) => {
        let event = { cid, publishedAt, scheduledAt, entropyNeeded };
        console.log('\nDrawLaunched 💥\n', JSON.stringify(event, null, 4));
    });
    console.log('Subscribed to DrawLaunched');


    contract.on("DrawLaunchedBatch", (cids) => {
        let event = { cids };
        console.log('\nDrawLaunchedBatch 💥\n', JSON.stringify(event, null, 4));
    });
    console.log('Subscribed to DrawLaunched');


    contract.on("RandomnessRequested", (requestId, cid, numWords, keyHash, s_subscriptionId, requestConfirmations, callbackGasLimit) => {
        let event = { requestId, cid, numWords, keyHash, s_subscriptionId, requestConfirmations, callbackGasLimit };
        console.log('\nRandomnessRequested 💥\n', JSON.stringify(event, null, 4));
    });
    console.log('Subscribed to RandomnessRequested');


    contract.on("RandomnessFulfilled", (requestId, randomWords) => {
        let event = { requestId, randomWords };
        console.log('\nRandomnessFulfilled 💥\n', JSON.stringify(event, null, 4));
    });
    console.log('Subscribed to RandomnessFulfilled');


    contract.on("DrawCompleted", (cid) => {
        let event = { cid };
        console.log('\nDrawCompleted 💥\n', JSON.stringify(event, null, 4));

        logWinners(cid);
    });
    console.log('Subscribed to DrawsCompleted');
}

async function logWinners(cid) {

    const winners = await contract.checkDrawWinners(cid);
    console.log(`\n✅ Winners for CID ${cid} are ${winners}\n`);
        
}