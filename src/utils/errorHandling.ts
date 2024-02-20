import { NextResponse } from 'next/server'

export async function buildNextResponseJson(handleRequest: Function) {

    const data: {response?: any, error?: any } = {}
    const response: any = {};
    let error: any;

    try {
        await handleRequest(response)

    } catch (err: any) {
        console.error(err);
        error = { message: err.message };
    }

    if (response) {
        data.response = response;
    }

    if (error) {
        data.error = error;
    }

    return NextResponse.json(data)
}
