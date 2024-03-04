import { kv } from "@vercel/kv";
 
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const cid = searchParams.get('cid')
    console.log(`Access draw ${cid}`);

    const fileData: string | null = await kv.get(`content_${cid}`);

    const dataHeaders = {
        status: (fileData) ? 200 : 404,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        }
    };

    return new Response(fileData, dataHeaders);
}