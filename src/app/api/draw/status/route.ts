import { NextResponse } from 'next/server'


export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const cid = searchParams.get('cid')
    if (!cid) {
        throw new Error("A cid parameter is needed.")
    }

    const token = process.env.WEB3_STORAGE_API_TOKEN
    if (!token) {
        throw new Error("A token is needed. You can create one on https://web3.storage")
    }

    console.log(`api/draw/status called with cid = ${cid}`);
  

    return NextResponse.json(true, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*', // Allow all IPFS gateways to query this endpoint
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}