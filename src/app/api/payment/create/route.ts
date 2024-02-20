import { NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripeSecretKey = (process.env.NEXT_PUBLIC_STRIPE_ENV === 'test') ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_PROD;

if (!stripeSecretKey) {
    throw new Error("stripeSecretKey is undefined")
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2022-11-15",
  typescript: true,
});
 
const drawPrice = 29.00; // in euros

const calculateOrderAmount = (nbDraws: number) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return drawPrice * 100 * nbDraws;
};

export async function POST() {

    //   Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(1),
        currency: "eur",
        automatic_payment_methods: {
            enabled: true,
        },
    });
 
    const data = {
        clientSecret: paymentIntent.client_secret,
    }
 
  return NextResponse.json(data)
}