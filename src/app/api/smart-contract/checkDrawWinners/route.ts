import { NextResponse } from 'next/server'
import { ethers } from 'ethers';
import contractAbi from '../../../../assets/abi'
// import { Redis } from '@upstash/redis'

// const redis = new Redis({
//     url: process.env.REDIS_URL as string,
//     token: process.env.REDIS_TOKEN as string
// });

const testMode = (process.env.NEXT_PUBLIC_APP_ENV != "prod");

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network')
    const contractAddress = searchParams.get('contractAddress')
    const cid = searchParams.get('cid')

    if (!network || !contractAddress || !cid) {
        throw new Error("'network', 'contractAddress', and 'cid' parameters are required.")
    }

    if (!process.env.WALLET_PRIVATE_KEY) {
        throw new Error("process.env.WALLET_PRIVATE_KEY not found.")
    }

    console.log(`api/smart-contract/checkDrawWinners called with network = ${network}, contractAddress = ${contractAddress}, and cid = ${cid}`);

    let winners: number[] = [];
    const cachedWinners: number[] = []; // await redis.smembers(`winners_${cid}`);

    if (cachedWinners.length > 0) {

        // Retrieve randomness in cache if present
        winners = cachedWinners;
        console.log(`Retrieved cached winners ${cid} : ${cachedWinners} from the KV store.`)

    } else {

        // Else retrieve from smart contract
        const mainnet = network === 'arbitrum-mainnet';
        const providerURL = ((mainnet && !testMode) ? process.env.NEXT_PUBLIC_MAINNET_RPC : process.env.NEXT_PUBLIC_TESTNET_RPC) as string;

        const jsonRpcProvider = new ethers.JsonRpcProvider(providerURL)
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, jsonRpcProvider);

        const contract = new ethers.Contract(
            contractAddress,
            contractAbi,
            wallet
        );

        try {
            let scResponse = await contract.checkDrawWinners(cid);
            const winnersString = (new String(scResponse)).toString(); // Force cast to String
            winners = winnersString.split(',').map(winner => Number(winner));
        } catch (err: any) {
            console.error(err);
        }
        

        // If winners have been generated, cache it
        // if (Array.isArray(winners) && winners.length > 0) {
        //     await redis.sadd(`winners_${cid}`, winners);
        //     console.log(`Added ${cid} : ${winners} in the KV store.`)
        // }
        
    }

    const response = { winners }

    return NextResponse.json(response, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow all IPFS gateways to query this endpoint
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}