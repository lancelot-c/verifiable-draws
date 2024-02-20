import fs from 'fs'
import hardhat from 'hardhat';
const fsPromises = fs.promises;
import path from 'path'
import crypto from 'crypto'
import axios from 'axios'
const { CONTRACT_NAME, WALLET_PRIVATE_KEY, TESTNET_CONTRACT_ADDRESS, MAINNET_CONTRACT_ADDRESS, TESTNET_API_URL, MAINNET_API_URL, MAINNET_GAS_STATION_URL, TESTNET_GAS_STATION_URL, WEB3_STORAGE_API_TOKEN } = process.env;
import { Web3Storage, getFilesFromPath } from 'web3.storage';
const network = hardhat.network.name;
// const gasStationURL = (network == 'mainnet') ? MAINNET_GAS_STATION_URL : TESTNET_GAS_STATION_URL;
const providerURL = (network == 'mainnet') ? MAINNET_API_URL : TESTNET_API_URL;
const contractAddress = (network == 'mainnet') ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync(`./artifacts/contracts/${CONTRACT_NAME}.sol/${CONTRACT_NAME}.json`)).abi;
const provider = new hardhat.ethers.Wallet(WALLET_PRIVATE_KEY, hardhat.ethers.provider);
const contract = new hardhat.ethers.Contract(
    contractAddress,
    abi,
    provider
);

// Override ethers.js gas settings
// Inspired from https://github.com/ethers-io/ethers.js/issues/2828#issuecomment-1531154466
// const originalGetFeeData = provider.getFeeData.bind(provider)
// provider.getFeeData = async () => {

//   const { data: { standard } } = await axios.get(gasStationURL)

//   const data = await originalGetFeeData()

//   data.maxFeePerGas = hardhat.ethers.utils.parseUnits(Math.round(standard.maxFee).toString(), 'gwei')
//   data.maxPriorityFeePerGas = hardhat.ethers.utils.parseUnits(Math.round(standard.maxPriorityFee).toString(), 'gwei')

//   return data
// }

async function main() {

    // Extract draws infos
    const drawTitle = process.env.npm_config_drawTitle;
    const drawRules = process.env.npm_config_drawRules;
    const drawParticipants = process.env.npm_config_drawParticipants;
    const drawNbWinners = process.env.npm_config_drawNbWinners;
    const drawScheduledAt = process.env.npm_config_drawScheduledAt;


    await createDraw(drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt);

}

export async function createDraw(drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt) {
    try {

        console.log(`drawTitle = \n"${drawTitle}"\n\n`);
        console.log(`drawRules = \n"${drawRules}"\n\n`);
        console.log(`drawParticipants = \n"${drawParticipants}"\n\n`);
        console.log(`drawNbWinners = \n"${drawNbWinners}"\n\n`);
        console.log(`drawScheduledAt = \n"${drawScheduledAt}"\n\n`);

        if (!drawTitle || !drawRules || !drawParticipants || !drawNbWinners || !drawScheduledAt) {
            throw Error('You need to specify all draw parameters.');
        }

        // Compute entropy needed
        const drawNbParticipants = drawParticipants.length;
        const entropyNeeded = await computeEntropyNeeded(drawNbParticipants, drawNbWinners);

        // Generate draw file
        const [drawFilepath, folderName] = await generateDrawFile(drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt);

        // Pin draw file on IPFS
        const rootCid = await pinOnIPFS(drawFilepath, drawTitle)
            .then((cid) => {
                // Rename draw file to match IPFS CID
                // renameFolderToIPFS_CID(folderName, cid);

                // Delete draw from filesystem
                deleteDraw(folderName);

                // Publish draw on smart contract
                publishOnSmartContract(cid, drawScheduledAt, entropyNeeded);

                return cid;
            });

        const drawFilename = path.basename(drawFilepath)
        return [rootCid, drawFilename]
        
    } catch (err) {
        console.error(err);
    }
}

async function generateDrawFile(drawTitle, drawRules, drawParticipants, drawNbWinners, unix_timestamp) {
    const templateFilepath = './draws/template.html';

    const content = await fsPromises.readFile(templateFilepath, 'utf8');

    drawParticipants = drawParticipants.split('\n');
    const drawParticipantsList = `'${drawParticipants.join('\',\'')}'`;

    // Replace placeholders with draw parameters
    const newContent = content
        .replaceAll('{{ providerURL }}', providerURL)
        .replaceAll('{{ contractAddress }}', contractAddress)
        .replaceAll('{{ drawTitle }}', drawTitle)
        .replaceAll('{{ drawScheduledAt }}', unix_timestamp)
        .replaceAll('{{ drawRules }}', drawRules.replaceAll('\n', '<br />'))
        .replaceAll('{{ drawNbParticipants }}', drawParticipants.length)
        .replaceAll('{{ drawParticipants }}', drawParticipantsList)
        .replaceAll('{{ drawNbWinners }}', drawNbWinners);

    const fileHash = sha256(newContent);
    const drawTempFilepath = `./draws/${fileHash}/draw.html`;

    await fs.promises.mkdir(`./draws/${fileHash}`).catch(console.error);
    await fsPromises.writeFile(drawTempFilepath, newContent, 'utf8');
    return [drawTempFilepath, fileHash];

}

function sha256(message) {
    return Buffer.from(crypto.createHash('sha256').update(message).digest('hex')).toString('base64');
}

async function pinOnIPFS(filepath, drawTitle) {
    console.log(`Uploading ${filepath} to IPFS...\n`);

    const token = WEB3_STORAGE_API_TOKEN
  
    if (!token) {
      return console.error('A token is needed. You can create one on https://web3.storage')
    }
  
    const storage = new Web3Storage({ token })
    const files = []
  
    const pathFiles = await getFilesFromPath(filepath)
    files.push(...pathFiles)

    let resolve;
    const cidPromise = new Promise((r) => {
        resolve = r;
    });

    const onRootCidReady = (rootCid) => {
        console.log(`Root CID is ${rootCid}\n`)
        resolve(rootCid);
    };

    storage.put(files, { name: drawTitle, wrapWithDirectory: true, onRootCidReady })
    return cidPromise;
}
  
async function renameFolderToIPFS_CID(folderName, cid) {
    const oldDirName = `./draws/${folderName}`
    const newDirName = `./draws/${cid}`

    fs.rename(oldDirName, newDirName, (err) => {
        if (err) {
            throw err
        }
    });
}

function deleteDraw(folderName) {
    fs.rmSync(`./draws/${folderName}`, { recursive: true, force: true });
}

async function computeEntropyNeeded(nbParticipants, nbWinners) {

    let entropyNeeded = 0;

    // Simple method
    entropyNeeded = nbWinners * Math.ceil(Math.log2(nbParticipants) / 8); // in bytes

    // Optimised using Information Theory
    // for (let i = 0; i < nbWinners; i++) {
    //     entropyNeeded += Math.ceil(Math.log2(nbParticipants - i) / 8); // in bytes
    // }

    console.log(`${entropyNeeded} bytes of entropy needed\n`);
    return entropyNeeded;
}

async function publishOnSmartContract(v1CidString, scheduledAt, entropyNeeded) {
    console.log(`Publish draw ${v1CidString} on smart contract ${contractAddress}\n`);

    const launchDraw = await contract.launchDraw(v1CidString, scheduledAt, entropyNeeded);
    await launchDraw.wait();
}

export async function triggerDraw(v1CidString) {
    const abi = hardhat.ethers.utils.defaultAbiCoder;
    const params = abi.encode(
        ["string[]"],
        [[v1CidString]]
    );
    console.log(`call performUpkeep(${params})\n`);

    const performUpkeep = await contract.performUpkeep(params);
    await performUpkeep.wait();

    console.log(`performUpkeep call done\n`);
}

function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}


// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     });
