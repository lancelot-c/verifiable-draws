import Stripe from 'stripe'
import { kv } from "@vercel/kv";
// import Hash from 'ipfs-only-hash'
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
const pinataSDK = require('@pinata/sdk');
const filePath = path.join(process.cwd(), `src/assets/${process.env.CONTRACT_NAME}.json`);
const network = (process.env.NEXT_PUBLIC_APP_ENV === 'test') ? 'testnet' : 'testnet';
let gasStationURL: string;
let providerBaseURL: string;
let providerKey: string;
let providerURL: string;
let contractAddress: string;
let etherscanAddress: string;
let provider: ethers.JsonRpcProvider;
let wallet: Wallet;
setEthersParams(network)

function setEthersParams(network: string) {
    gasStationURL = ((network === 'mainnet') ? process.env.MAINNET_GAS_STATION_URL : process.env.TESTNET_GAS_STATION_URL) as string;
    providerBaseURL = ((network === 'mainnet') ? process.env.MAINNET_API_URL : process.env.TESTNET_API_URL) as string;
    providerKey = ((network === 'mainnet') ? process.env.MAINNET_API_KEY : process.env.TESTNET_API_KEY) as string;
    providerURL = `${providerBaseURL}${providerKey}`;
    contractAddress = ((network === 'mainnet') ? process.env.MAINNET_CONTRACT_ADDRESS : process.env.TESTNET_CONTRACT_ADDRESS) as string;
    etherscanAddress = (network === 'mainnet') ? "https://polygonscan.com" : "https://sepolia.arbiscan.io";
    provider = new ethers.JsonRpcProvider(providerURL)

    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("process.env.WALLET_PRIVATE_KEY is not defined")
    }
    wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
}

let maxFeePerGas = BigInt("40000000000") // fallback to 40 gwei
let maxPriorityFeePerGas = BigInt("40000000000") // fallback to 40 gwei


const stripeSecretKey = (process.env.NEXT_PUBLIC_STRIPE_ENV === 'test') ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_PROD;

if (!stripeSecretKey) {
    throw new Error("stripeSecretKey is undefined")
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
    typescript: true,
});


export async function POST(request: Request) {

    return await buildNextResponseJson(async (response: any) => {

        const body = await request.json()
        const paymentIntentId: string = body.paymentIntentId
        const code: string = 'siegfried'
        
        // Me, Insight Media, Morning, Smartplay
        const validCodes = ['siegfried', 'zatzikhoven', 'goodmorning', 'arandomlotterycompany'] // These codes get free draws
        const testCodes: string[] = [];
        let codeUsed = false;
        let testMode = true;

        if (code) {

            if (validCodes.includes(code)) {
                codeUsed = true;
                console.log(`code ${code} used`);

                if (testCodes.includes(code)) {
                    testMode = true;
                    console.log(`test mode activated`);
                }

            } else {
                throw new Error(`Invalid code ${code} used`)
            }
            

        } else {

            // Cancel the request if something is wrong with the payment
            await verifyPayment(paymentIntentId);
            console.log(`Payment ${paymentIntentId} is valid. Draw deployment in progress...`);
        }
        

        // Deploy draw
        const drawTitle: string = body.drawTitle;
        const drawRules: string = body.drawRules;
        const drawParticipants: string = body.drawParticipants;
        const drawNbWinners: number = body.drawNbWinners;
        const drawScheduledAt: number = body.drawScheduledAt;

        response.cid = await createDraw(drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt, testMode);

        if (codeUsed) {

            const codeValue = await kv.get(`code_${code}`);
            let count: number = 0;

            if (Number.isInteger(codeValue)) {
                count = codeValue as number
            }
            count++;

            await kv.set(`code_${code}`, count);
            console.log(`Code ${code} has been used ${count} times.`)

        } else {
            // Set order as delivered
            try {
                await kv.set(paymentIntentId, 1);
                console.log(`Set ${paymentIntentId} : 1 in the KV store.`)
            } catch (error) {
                throw new Error(`Can't set ${paymentIntentId} value in the KV store`)
            }
        }

    })
}

async function verifyPayment(paymentIntentId: string): Promise<0> {
    return new Promise(async (resolve) => {

        // 0 = not delivered yet, 1 = delivered
        const orderStatus = await kv.get(paymentIntentId);
        if (orderStatus === 0) {
            return resolve(orderStatus);
        }

        const retryResult = await kvRetryGet(paymentIntentId);
        return resolve(retryResult);
    });
}

async function kvRetryGet(paymentIntentId: string, delay = 3000, retries = 3): Promise<0> {
    return new Promise(async (resolve) => {

        console.log(`KV retry get() for ${paymentIntentId} - delay:${delay} - retries:${retries}`);

        if (retries === 0) {
            throw new Error(`wrong use of kvRetryGet, retries should be > 0`)
        }

        setTimeout(async () => {
            const orderStatus = await kv.get(paymentIntentId);

            if (orderStatus === undefined || orderStatus === null) {
                if (--retries > 0) {
                    await kvRetryGet(paymentIntentId, delay * 2, retries);
                } else {
                    throw new Error(`No value in KV store for ${paymentIntentId} after ${retries + 1} get() attempts`)
                }
            } else if (orderStatus === 1) {
                throw new Error(`Order ${paymentIntentId} was already delivered`)
            } else if (orderStatus !== 0) {
                throw new Error(`Unknown status for order ${paymentIntentId} : ${orderStatus}`)
            }

            return resolve(0);

        }, delay);

    });
}

async function createDraw(
    drawTitle: string,
    drawRules: string,
    drawParticipants: string,
    drawNbWinners: number,
    drawScheduledAt: number,
    testMode: boolean
): Promise<string | undefined> {

    if (!drawTitle || !drawRules || !drawParticipants || !drawNbWinners || !drawScheduledAt) {
        throw new Error('You need to specify all draw parameters.');
    }

    if (testMode) {
        setEthersParams('testnet')
    }

    // Compute entropy needed
    const drawParticipantsArray = drawParticipants.split('\n').filter(n => n);
    const drawNbParticipants = drawParticipantsArray.length;

    // Generate draw file
    const [cid, content] = await generateDrawFile(drawTitle, drawRules, drawParticipantsArray, drawNbParticipants, drawNbWinners, drawScheduledAt);

    // Pin draw file on IPFS
    // const cid = await pinFileToIPFS(drawFilepath, drawTitle);
    await pinInKV(cid, content);

    // Rename draw file to match IPFS CID
    // await renameFileToCid(drawFilepath, cid);

    // Delete temp file
    // deleteTmpDrawFile(drawFilepath);

    // Publish draw on smart contract
    await publishOnSmartContract(cid, drawScheduledAt, drawNbParticipants, drawNbWinners);

    return cid

}

// async function renameFileToCid(oldPath: string, cid: string) {
//     const newPath = path.join(process.cwd(), `/src/app/ipfs/${cid}.html`);
//     console.log(`Rename ${oldPath} to ${newPath}`);
//     return fsPromises.rename(oldPath, newPath);
// }

function deleteTmpDrawFile(drawFilepath: string) {
    fs.unlink(drawFilepath, (err) => {
        if (err) {
            throw err;
        }

        console.log(`Deleted ${drawFilepath} successfully.`);
    });
}


async function generateDrawFile(drawTitle: string, drawRules: string, drawParticipantsArray: string[], drawNbParticipants: number, drawNbWinners: number, unix_timestamp: number) {
    const templateFilepath = path.join(process.cwd(), '/src/template/template_en.html');
    console.log(`templateFilepath = ${templateFilepath}`);

    const content = await fsPromises.readFile(templateFilepath, 'utf8');

    const network = providerBaseURL.slice(8).split('.')[0];
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

async function pinFileToIPFS(filepath: string, filename: string): Promise<string> {
    console.log(`Uploading ${filepath} to IPFS...\n`);

    let cid;

    // *** Using Pinata ***
    // ⚠️ As of February 2024 you have to pay 20€/month to upload .html files on Pinata, it isn't allowed on their free plan

    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_API_JWT});

    const readableStreamForFile = fs.createReadStream(filepath);
    const options = {
        pinataMetadata: {
            name: filename,
        },
        pinataOptions: {
            cidVersion: 1
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

async function publishOnSmartContract(v1CidString: string, scheduledAt: number, nbParticipants: number, nbWinners: number) {
    console.log(`Publish draw ${v1CidString} on smart contract ${contractAddress}, scheduled at ${scheduledAt}\n`);

    const jsonData = await fsPromises.readFile(filePath);
    const abi = JSON.parse(jsonData.toString()).abi;

    const contract = new ethers.Contract(
        contractAddress,
        abi,
        wallet
    );

    await setOptimalGas();

    try {
        await contract.launchDraw(v1CidString, scheduledAt, nbParticipants, nbWinners, {
            maxFeePerGas,
            maxPriorityFeePerGas,
        });
    } catch (err: any) {
        console.error(err);
        throw new Error(`Failed to deploy the draw on the smart contract.`);
    }

}

function sha256(message: string) {
    return Buffer.from(crypto.createHash('sha256').update(message).digest('hex')).toString('base64');
}

// Call this function every time before a contract call
async function setOptimalGas() {
    try {
        const { data } = await axios({
            method: 'get',
            url: gasStationURL
        });
        maxFeePerGas = ethers.parseUnits(
            Math.ceil(data.fast.maxFee) + '',
            'gwei'
        )
        maxPriorityFeePerGas = ethers.parseUnits(
            Math.ceil(data.fast.maxPriorityFee) + '',
            'gwei'
        )
    } catch {
        console.error(`Failed to call the gas station at ${gasStationURL}`);
    }
}