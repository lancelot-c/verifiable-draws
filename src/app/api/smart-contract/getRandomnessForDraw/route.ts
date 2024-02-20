import { NextResponse } from 'next/server'
import fsPromises from 'fs/promises';
import path from 'path'
import { ethers } from 'ethers';
import { kv } from "@vercel/kv";


export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')
    const contractAddress = searchParams.get('contractAddress')
    const cid = searchParams.get('cid')

    if (!network || !contractAddress || !cid) {
        throw new Error("'network', 'contractAddress', and 'cid' parameters are required.")
    }

    // if (network !== "polygon-mainnet" && network !== "arbitrumSepolia") {
    //     throw new Error(`Network ${network} is not supported.`)
    // }

    // const expectedContractAddress = ((network === 'polygon-mainnet') ? process.env.MAINNET_CONTRACT_ADDRESS : process.env.TESTNET_CONTRACT_ADDRESS) as string;
    // if (contractAddress !== expectedContractAddress) {
    //     throw new Error(`Wrong contract address. Expected ${expectedContractAddress}, got ${contractAddress}.`)
    // }

    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("process.env.WALLET_PRIVATE_KEY not found.")
    }

    console.log(`api/smart-contract/getRandomnessForDraw called with network = ${network}, contractAddress = ${contractAddress}, and cid = ${cid}`);

    let bytes;
    const emptyBytes = "0x";
    const cachedBytes = await kv.get(`randomness_${cid}`);

    if (cachedBytes && cachedBytes != emptyBytes) {

        // Retrieve randomness in cache if present
        bytes = cachedBytes;
        console.log(`Retrieved cached bytes ${cid} : ${cachedBytes} from the KV store.`)

    } else {

        // Else retrieve from smart contract
        const providerBaseURL = (network === 'polygon-mainnet') ? process.env.MAINNET_API_URL : process.env.TESTNET_API_URL;
        const providerKey = (network === 'polygon-mainnet') ? process.env.MAINNET_API_KEY : process.env.TESTNET_API_KEY;
        const providerURL = `${providerBaseURL}${providerKey}`;

        const jsonRpcProvider = new ethers.JsonRpcProvider(providerURL)
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, jsonRpcProvider);

        const contractArtifactFilePath = path.join(process.cwd(), `src/assets/${process.env.CONTRACT_NAME}.json`);
        const contractArtifact = await fsPromises.readFile(contractArtifactFilePath);
        const contractAbi = JSON.parse(contractArtifact.toString()).abi;


        const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            wallet
        );

        bytes = await contract.getRandomnessForDraw(cid);

        // If randomness have been generated, cache it
        if (bytes && bytes != emptyBytes) {
            await kv.set(`randomness_${cid}`, bytes);
            console.log(`Added ${cid} : ${bytes} in the KV store.`)
        }
    
    }

    
    const response = { bytes }

    return NextResponse.json(response, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow all IPFS gateways to query this endpoint
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}