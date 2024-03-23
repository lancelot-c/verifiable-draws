import { Redis } from '@upstash/redis'
import fs from 'fs';
const fsPromises = fs.promises;
import path from 'path'
import { Wallet, ethers } from 'ethers';
import { buildNextResponseJson } from './../../../../utils/errorHandling';
import { unixfs } from "@helia/unixfs"
import { BlackHoleBlockstore } from "blockstore-core/black-hole"
import { fixedSize } from "ipfs-unixfs-importer/chunker"
import { balanced } from "ipfs-unixfs-importer/layout"
import { numberWithCommas } from './../../../../utils/misc'
import { FleekSdk, PersonalAccessTokenService } from '@fleekxyz/sdk';
import contractAbi from '../../../../assets/abi'
const testMode = (process.env.NEXT_PUBLIC_APP_ENV != "prod");
let providerURL: string;
let contractAddress: string;
let etherscanAddress: string;
let provider: ethers.JsonRpcProvider;
let wallet: Wallet;
let network: string;
let contract: ethers.Contract;
let price: bigint;

const redis = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string
});


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
        const signature: string = body.signature;

        response.cid = await createDraw(owner, signature, drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt, mainnet);

    })
}

async function createDraw(
    owner: string,
    signature: string,
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

    // Check if signature is valid, only needed for mainnet because we are the owner for testnet
    if (mainnet) {
        owner = await validateSignature(owner, signature);
    }

    await setEthersParams(mainnet)

    // Check if balance is valid
    await validateBalance(owner);

    // Generate draw file
    let [generatedCid, content] = await generateDrawFile(drawTitle, drawRules, drawParticipantsArray, drawNbParticipants, drawNbWinners, drawScheduledAt);

    // Pin draw file on IPFS for mainnet
    if (mainnet) {

        const tempFilepath = `/tmp/${generatedCid}.html`;
        fs.writeFileSync(tempFilepath, content);

        const ipfsCid = await pinFileToIPFS(tempFilepath);
        generatedCid = ipfsCid;

        deleteFile(tempFilepath);

    } else {

        // Or pin in local db for testnet
        await pinInKV(generatedCid, content);
    }

    // Check if CID does not already exist
    // TODO: ideally, precompute the CID, then call validateCid, and only then call pinFileToIPFS to avoid storing duplicate files on IPFS
    await validateCid(generatedCid);

    // Publish draw on smart contract
    await publishOnSmartContract(owner, generatedCid, drawScheduledAt, drawNbParticipants, drawNbWinners);

    return generatedCid

}

async function setEthersParams(mainnet: boolean) {
    network = (mainnet && !testMode) ? "arbitrum-mainnet" : "arbitrum-sepolia";
    contractAddress = ((mainnet && !testMode) ? process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS) as string;
    etherscanAddress = (mainnet && !testMode) ? "https://arbiscan.io" : "https://sepolia.arbiscan.io";
    providerURL = ((mainnet && !testMode) ? process.env.NEXT_PUBLIC_MAINNET_RPC : process.env.NEXT_PUBLIC_TESTNET_RPC) as string;
    provider = new ethers.JsonRpcProvider(providerURL)
    
    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("process.env.WALLET_PRIVATE_KEY is not defined")
    }
    wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL : 'http://localhost:3000'
    const ethPrice = await fetch(`${baseUrl}/api/payment/eth-usd-price`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    })
        .then(res => res.json())
        .then(data => data.ethereum.usd);

    const ethAmount = Number(process.env.NEXT_PUBLIC_DRAW_USD_PRICE) / ethPrice;
    price = ethers.parseEther(ethAmount.toFixed(18).toString());

    contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
    );
}


async function validateSignature(address: string, signature: string): Promise<string> {

    const message = `Verifiable Draws wants you to sign in with your Ethereum account ${address}.\n\nSigning is the only way we can truly know that you are the owner of the wallet you are connecting. Signing is a safe, gas-less transaction that does not in any way give Verifiable Draws permission to perform any transactions with your wallet.`;


    try {
        const signerAddress = await ethers.verifyMessage(message, signature);

        // Convert both to lower case because signerAddress is always case sensitive whereas address is potentially case insensitive
        if (signerAddress.toLowerCase() !== address.toLowerCase()) {
            throw new Error(`Invalid signature ${signature}, match address ${signerAddress} instead of ${address}.`);
        }

        return signerAddress; // Return the case sensitive address to update the current one

    } catch (err: any) {
        console.log(err);
        throw new Error(err);
    }
}


async function validateBalance(address: string) {

    // Check user balance
    try {

        if (address != process.env.WALLET_PUBLIC_KEY) {
            const balance: number = await contract.userBalances(address);

            if (balance < price) {
                throw new Error(`Not enough funds for ${address}, need ${price} wei, got ${balance} wei, please call the topUp function from the contract to top up your account, then try again.`);
            }
        }
        
    } catch {
        throw new Error("Couldn't call userBalances from contract");
    }
}


async function validateCid(cid: string) {

    // Check if draw already exist
    try {
        const draw: any = await contract.draws(cid);

        if (draw.publishedAt != 0) {
            throw new Error(`Draw with CID ${cid} already exists.`);
        }
    } catch {
        throw new Error("Couldn't call draws from contract");
    }
}


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
        drawRules = `Draw ${numberWithCommas(drawNbWinners)} winner${drawNbWinners > 1 ? 's' : ''} randomly out of the ${numberWithCommas(drawNbParticipants)} participant${drawNbParticipants > 1 ? 's' : ''}.`;
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

    // *** Using Fleek.xyz ***
    const newAccessTokenService = new PersonalAccessTokenService({
        personalAccessToken: process.env.FLEEK_ACCESS_TOKEN as string,
        projectId: process.env.FLEEK_PROJECT_ID as string,
    })
    
    const fleekSdk = new FleekSdk({ accessTokenService: newAccessTokenService });

    const fileToUploads = [];
    const buffer = fs.readFileSync(filepath);
    fileToUploads.push({ path: `verifiable-draw.html`, content: buffer });

    const options = {
        wrapWithDirectory: true
    };
    
    const result = await fleekSdk.ipfs().addAll(fileToUploads, options);
    cid = result[1].cid.toV1().toString();


    // *** Using Pinata ***
    // ⚠️ As of February 2024 you have to pay 20€/month to upload .html files on Pinata, it isn't allowed on their free plan

    // const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_API_JWT});

    // const readableStreamForFile = fs.createReadStream(filepath);
    // const options = {
    //     pinataMetadata: {
    //         name: 'verifiable-draw.html',
    //     },
    //     pinataOptions: {
    //         cidVersion: 1,
    //         wrapWithDirectory: true
    //     }
    // };
    // const res = await pinata.pinFileToIPFS(readableStreamForFile, options)
    // console.log(`Pinata response:`, res)
    // cid = res.IpfsHash

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
    await redis.sadd(`content_${cid}`, content);
}

async function publishOnSmartContract(owner: string, cid: string, scheduledAt: number, nbParticipants: number, nbWinners: number) {

    console.log(`deployDraw ${cid} with price ${price} on smart contract ${contractAddress}\n`);

    contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        wallet
    );

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