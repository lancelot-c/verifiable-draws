import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { kv } from "@vercel/kv";
const stripeSecretKey = (process.env.NEXT_PUBLIC_STRIPE_ENV === 'test') ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_PROD;
const endpointSecret = (process.env.NEXT_PUBLIC_STRIPE_ENV === 'test') ? process.env.PAYMENT_SUCCEEDED_SIGNING_SECRET_TEST : process.env.PAYMENT_SUCCEEDED_SIGNING_SECRET_PROD;

if (!stripeSecretKey) {
    throw new Error("stripeSecretKey is undefined")
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
    typescript: true,
});

export async function POST(request: Request) {

    const sig = request.headers.get('stripe-signature');

    let event;

    try {
        const body = await request.text()
        
        if (sig && endpointSecret) {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        }
        
    } catch (err: any) {
        // response.status(400).send(`Webhook Error: ${err.message}`);
        const data = {
            message: `Webhook Error: ${err.message}`,
        }
    
        return NextResponse.json(data)
    }

    // Handle the event
    switch (event?.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object as any;

            try {
                await kv.set(paymentIntentSucceeded.id, 0);
                console.log(`Added ${paymentIntentSucceeded.id} : 0 in the KV store.`)
              } catch (error) {
                throw new Error(`Can't add ${paymentIntentSucceeded.id} : 0 to the KV store`)
            }

            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event?.type}`);
    }

    const data = {
        message: 'ok',
    }

    return NextResponse.json(data)
}