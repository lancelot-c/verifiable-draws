import { NextResponse } from 'next/server'
import fetch from 'node-fetch';

export async function GET(request: Request) {

    if (!process.env.COINGECKO_API_KEY) {
        return;
    }

    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    const options = {method: 'GET', headers: {'x-cg-demo-api-key': process.env.COINGECKO_API_KEY}};

    const jsonRes = await fetch(url, options)
        .then((res: any) => res.json())
        .catch((err: any) => console.error('error:' + err));

    return NextResponse.json(jsonRes)
}