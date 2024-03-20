import fetch from 'node-fetch';
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.REDIS_URL as string,
    token: process.env.REDIS_TOKEN as string
});
 
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const cid = searchParams.get('cid')
    console.log(`Access draw ${cid}`);

    const pinataUrl = `https://${process.env.PINATA_GATEWAY_DOMAIN}/ipfs/${cid}/verifiable-draw.html`
    let fileData: string | null = null;

    // Try fetching from Pinata first
    try {
        const response = await fetch(pinataUrl); // See doc here: https://www.npmjs.com/package/node-fetch#plain-text-or-html

        // Found on Pinata
        if (response.ok) {
            fileData = await response.text();
        } else {
            // Client or server error (4XX or 5XX error), do nothing
        }
        
    } catch (error) {
        // Network error, should never happen
        console.error(`Couldn't reach the pinata gateway`, error);
    }

    // If nothing was fetched from Pinata try fetching from KV
    if (!fileData) {
        fileData = (await redis.smembers(`content_${cid}`))[0];
    }

    const dataHeaders = {
        status: (fileData) ? 200 : 404,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    };

    return new Response(fileData, dataHeaders);
}