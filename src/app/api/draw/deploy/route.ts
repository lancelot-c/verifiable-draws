import { kv } from "@vercel/kv";
import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path'
import axios from 'axios'
import { Wallet, ethers } from 'ethers';
import crypto from 'crypto'
import { buildNextResponseJson } from './../../../../utils/errorHandling';
import { unixfs } from "@helia/unixfs"
import { BlackHoleBlockstore } from "blockstore-core/black-hole"
import { fixedSize } from "ipfs-unixfs-importer/chunker"
import { balanced } from "ipfs-unixfs-importer/layout"
import { numberWithCommas } from './../../../../utils/misc'
const pinataSDK = require('@pinata/sdk');
import contractAbi from '../../../../assets/abi'
// const filePath = path.join(process.cwd(), `src/assets/${process.env.CONTRACT_NAME}.json`);
const testMode = (process.env.NEXT_PUBLIC_APP_ENV != "prod");
// let gasStationURL: string;
// let providerBaseURL: string;
// let providerKey: string;
let providerURL: string;
let contractAddress: string;
let etherscanAddress: string;
let provider: ethers.JsonRpcProvider;
let wallet: Wallet;
let network: string;

// let maxFeePerGas = BigInt("400000000") // fallback to 400 gwei
// let maxPriorityFeePerGas = BigInt("4000000000000") // fallback to 400 gwei

async function setEthersParams(mainnet: boolean) {
    // gasStationURL = ((network === 'mainnet') ? process.env.MAINNET_GAS_STATION_URL : process.env.TESTNET_GAS_STATION_URL) as string;
    // providerBaseURL = ((network === 'mainnet') ? process.env.MAINNET_API_URL : process.env.TESTNET_API_URL) as string;
    // providerKey = ((network === 'mainnet') ? process.env.MAINNET_API_KEY : process.env.TESTNET_API_KEY) as string;
    network = (mainnet && !testMode) ? "arbitrum-mainnet" : "arbitrum-sepolia";
    contractAddress = ((mainnet && !testMode) ? process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS) as string;
    etherscanAddress = (mainnet && !testMode) ? "https://arbiscan.io" : "https://sepolia.arbiscan.io";
    providerURL = ((mainnet && !testMode) ? process.env.NEXT_PUBLIC_MAINNET_RPC : process.env.NEXT_PUBLIC_TESTNET_RPC) as string;
    provider = new ethers.JsonRpcProvider(providerURL)
    
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("process.env.WALLET_PRIVATE_KEY is not defined")
    }
    wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
}





export async function POST(request: Request) {

    return await buildNextResponseJson(async (response: any) => {

        const body = await request.json()
        

        // Deploy draw
        const drawTitle: string = body.drawTitle;
        const drawRules: string = body.drawRules;
        const drawParticipants: string = body.drawParticipants;
        const drawNbWinners: number = body.drawNbWinners;
        const drawScheduledAt: number = body.drawScheduledAt;
        const mainnet: boolean = body.mainnet;
        const owner: string = (mainnet) ? body.owner : process.env.WALLET_PUBLIC_KEY; // We take ownership of the draw on testnet

        response.cid = await createDraw(owner, drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt, mainnet);

    })
}

// async function kvRetryGet(paymentIntentId: string, delay = 3000, retries = 3): Promise<0> {
//     return new Promise(async (resolve) => {

//         console.log(`KV retry get() for ${paymentIntentId} - delay:${delay} - retries:${retries}`);

//         if (retries === 0) {
//             throw new Error(`wrong use of kvRetryGet, retries should be > 0`)
//         }

//         setTimeout(async () => {
//             const orderStatus = await kv.get(paymentIntentId);

//             if (orderStatus === undefined || orderStatus === null) {
//                 if (--retries > 0) {
//                     await kvRetryGet(paymentIntentId, delay * 2, retries);
//                 } else {
//                     throw new Error(`No value in KV store for ${paymentIntentId} after ${retries + 1} get() attempts`)
//                 }
//             } else if (orderStatus === 1) {
//                 throw new Error(`Order ${paymentIntentId} was already delivered`)
//             } else if (orderStatus !== 0) {
//                 throw new Error(`Unknown status for order ${paymentIntentId} : ${orderStatus}`)
//             }

//             return resolve(0);

//         }, delay);

//     });
// }

async function createDraw(
    owner: string,
    drawTitle: string,
    drawRules: string,
    drawParticipants: string,
    drawNbWinners: number,
    drawScheduledAt: number,
    mainnet: boolean
): Promise<string | undefined> {

    if (!drawTitle || !drawParticipants || !drawNbWinners || !drawScheduledAt) {
        throw new Error('You need to specify all draw parameters.');
    }    

    const drawParticipantsArray = drawParticipants.split('\n').filter(n => n);
    const drawNbParticipants = drawParticipantsArray.length;

    const maxParticipantsAllowed = (mainnet ? process.env.NEXT_PUBLIC_MAINNET_MAX_PARTICIPANTS : process.env.NEXT_PUBLIC_TESTNET_MAX_PARTICIPANTS) as unknown as number;
    const maxWinnersAllowed = (mainnet ? process.env.NEXT_PUBLIC_MAINNET_MAX_WINNERS : process.env.NEXT_PUBLIC_TESTNET_MAX_WINNERS) as unknown as number;

    if (drawNbParticipants > maxParticipantsAllowed) {
        throw new Error(`Your draw has ${drawNbParticipants} participants whereas the maximum allowed is ${maxParticipantsAllowed} on ${mainnet ? 'mainnet' : 'testnet'}.`);
    }

    if (drawNbWinners > maxWinnersAllowed) {
        throw new Error(`Your draw has ${drawNbWinners} winners whereas the maximum allowed is ${maxWinnersAllowed} on ${mainnet ? 'mainnet' : 'testnet'}.`);
    }

    await setEthersParams(mainnet)

    // Generate draw file
    let [generatedCid, content] = await generateDrawFile(drawTitle, drawRules, drawParticipantsArray, drawNbParticipants, drawNbWinners, drawScheduledAt);

    // Pin draw file on IPFS
    if (mainnet) {

        const tempFilepath = `/tmp/${generatedCid}.html`;
        fs.writeFileSync(tempFilepath, content);

        const ipfsCid = await pinFileToIPFS(tempFilepath);
        generatedCid = ipfsCid;

        deleteFile(tempFilepath);
    }
    
    await pinInKV(generatedCid, content);

    // Rename draw file to match IPFS CID
    // await renameFileToCid(drawFilepath, cid);

    // Delete temp file
    // deleteTmpDrawFile(drawFilepath);

    // Publish draw on smart contract
    await publishOnSmartContract(owner, generatedCid, drawScheduledAt, drawNbParticipants, drawNbWinners);

    return generatedCid

}

// async function renameFileToCid(oldPath: string, cid: string) {
//     const newPath = path.join(process.cwd(), `/src/app/ipfs/${cid}.html`);
//     console.log(`Rename ${oldPath} to ${newPath}`);
//     return fsPromises.rename(oldPath, newPath);
// }

function deleteFile(filepath: string) {
    fs.unlink(filepath, (err) => {
        if (err) {
            throw err;
        }

        console.log(`Deleted ${filepath} successfully.`);
    });
}


async function generateDrawFile(drawTitle: string, drawRules: string, drawParticipantsArray: string[], drawNbParticipants: number, drawNbWinners: number, unix_timestamp: number) {
    const templateFilepath = path.join(process.cwd(), '/src/template/template_en.html');
    console.log(`templateFilepath = ${templateFilepath}`);

    const content = await fsPromises.readFile(templateFilepath, 'utf8');

    if (!drawRules) {
        drawRules = `Draw ${numberWithCommas(drawNbWinners)} winners randomly out of the ${numberWithCommas(drawNbParticipants)} participants.`;
    } 

    const drawParticipantsList = `'${drawParticipantsArray.join('\',\'')}'`;

    // Replace placeholders with draw parameters
    const newContent = content
        .replaceAll('{{ network }}', network)
        .replaceAll('{{ contractAddress }}', contractAddress)
        .replaceAll('{{ etherscanAddress }}', etherscanAddress)
        .replaceAll('{{ drawTitle }}', drawTitle)
        .replaceAll('{{ drawScheduledAt }}', unix_timestamp.toString())
        .replaceAll('{{ drawRules }}', drawRules.replaceAll('\n', '<br />'))
        .replaceAll('{{ drawNbParticipants }}', drawNbParticipants.toString())
        .replaceAll('{{ drawParticipants }}', drawParticipantsList)
        .replaceAll('{{ drawNbWinners }}', drawNbWinners.toString());

    const cid = await calculateCidFromString(newContent);
    // const drawTempFilepath = `/tmp/${fileHash}.html`;
    // console.log(`drawTempFilepath = ${drawTempFilepath}`);

    // await fsPromises.writeFile(drawTempFilepath, newContent, 'utf8');

    return [cid, newContent];

}

async function pinFileToIPFS(filepath: string): Promise<string> {
    console.log(`Uploading ${filepath} to IPFS...\n`);

    let cid;

    // *** Using Pinata ***
    // ⚠️ As of February 2024 you have to pay 20€/month to upload .html files on Pinata, it isn't allowed on their free plan

    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_API_JWT});

    const readableStreamForFile = fs.createReadStream(filepath);
    const options = {
        pinataMetadata: {
            name: 'verifiable-draw.html',
        },
        pinataOptions: {
            cidVersion: 1,
            wrapWithDirectory: true
        }
    };
    const res = await pinata.pinFileToIPFS(readableStreamForFile, options)
    console.log(`Pinata response:`, res)
    cid = res.IpfsHash

    // *** Using ipfs-only-hash ***
    // cid = await Hash.of('data')

    // *** Using @helia/unixfs ***
    // cid = await calculateCidFromFile(filepath);

    return cid;
}

// From https://www.turfemon.com/pre-calculate-cid
async function calculateCidFromBytes(bytes: Uint8Array) {
	const unixFs = unixfs({
	  blockstore: new BlackHoleBlockstore(),
	})
	
	const cid = await unixFs.addBytes(bytes, {
	  cidVersion: 0,
	  rawLeaves: false,
	  leafType: "file",
	  layout: balanced({
	    maxChildrenPerNode: 174,
	  }),
	  chunker: fixedSize({
	    chunkSize: 262144,
	  }),
	})
	
	const cidv0 = cid.toV0().toString() // QmPK1s...
	const cidv1 = cid.toV1().toString() // b45165...

    return cidv1;
}


async function calculateCidFromFile(filepath: string) {

	let resolve: Function;
    const cidPromise: Promise<string> = new Promise((r) => {
        resolve = r;
    });

    fs.readFile(filepath, 'utf8', async (err, data) => {

        const calculatedCid = await calculateCidFromString(data);
        console.log(`Calculated CID is ${calculatedCid}\n`)
        resolve(calculatedCid);

        if (err) {
            console.error('Error while reading template', err);
        }
    });

    return cidPromise;
}

async function calculateCidFromString(str: string) {

	const textEncoder = new TextEncoder()
    const uint8Array = textEncoder.encode(str)
    return await calculateCidFromBytes(uint8Array);
}

async function pinInKV(cid: string, content: string) {
    await kv.set(`content_${cid}`, content);
}

async function publishOnSmartContract(owner: string, cid: string, scheduledAt: number, nbParticipants: number, nbWinners: number) {

    // const jsonData = await fsPromises.readFile(filePath);
    // const abi = JSON.parse(jsonData.toString()).abi;

    const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        wallet
    );

    // await setOptimalGas();

    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL : 'http://localhost:3000'
    const ethPrice = await fetch(`${baseUrl}/api/payment/eth-usd-price`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then(res => res.json())
        .then(data => data.ethereum.usd);

    const ethAmount = Number(process.env.NEXT_PUBLIC_DRAW_USD_PRICE) / ethPrice;
    const price = ethers.parseEther(ethAmount.toFixed(18).toString());

    console.log(`deployDraw ${cid} with price ${price} on smart contract ${contractAddress}\n`);

    try {
        await contract.deployDraw(owner, cid, scheduledAt, nbParticipants, nbWinners, price
            , {
                maxPriorityFeePerGas: 100000000, // cannot be more than block fee per gas of 200000000
                gasLimit: 1000000,
            }
        );
    } catch (err: any) {
        console.error(err);
        throw new Error(`Failed to deploy the draw on the smart contract.`);
    }

}

// function sha256(message: string) {
//     return Buffer.from(crypto.createHash('sha256').update(message).digest('hex')).toString('base64');
// }

// Call this function every time before a contract call
// async function setOptimalGas() {
//     try {
//         const { data } = await axios({
//             method: 'get',
//             url: gasStationURL
//         });
//         maxFeePerGas = ethers.parseUnits(
//             Math.ceil(data.fast.maxFee) + '',
//             'gwei'
//         )
//         maxPriorityFeePerGas = ethers.parseUnits(
//             Math.ceil(data.fast.maxPriorityFee) + '',
//             'gwei'
//         )
//     } catch {
//         console.error(`Failed to call the gas station at ${gasStationURL}`);
//     }
// }