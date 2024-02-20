import { XCircleIcon } from '@heroicons/react/20/solid'
import { useState, useEffect } from 'react';
import { PaymentIntent } from "@stripe/stripe-js";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";


export default function CheckoutForm(
    { onPaymentSuccess }: { onPaymentSuccess: (intent: PaymentIntent) => void }
) {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e: any) => {
        // e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000/launch-draw#share",
            },
            redirect: "if_required"
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error && (error.type === "card_error" || error.type === "validation_error")) {
            setMessage(error.message);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            onPaymentSuccess(paymentIntent);
          } else {
            setMessage("An unexpected error occurred.");
          }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        paymentMethodOrder: ["card", "paypal", "link", "afterpay_clearpay", "klarna", "giropay"], // the others are added afterwards by Stripe
        wallets: {
            applePay: 'auto' as const,
            googlePay: 'auto' as const,
        },
        layout: 'tabs' as const,
    };

    return (
        <div>
            <LinkAuthenticationElement
                id="link-authentication-element"
                onChange={(e) => setEmail(e.value.email)}
            />
            <PaymentElement id="payment-element" options={paymentElementOptions} />

            <button
                // type="submit"
                onClick={handleSubmit}
                disabled={isLoading || !stripe || !elements}
                className={`rounded-md w-full mt-5 px-3 py-2 text-sm font-semibold text-white shadow inline-flex items-center justify-center leading-6 transition ease-in-out duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                ${isLoading || !stripe || !elements ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}

                {isLoading ? "Processing..." : "Pay 29,00€ and deploy the draw"}
            </button>

                    <p className="text-center text-xs text-gray-400 py-4">
                        Powered by Stripe.<br />
                        Verifiable Draws does not store your payment details.
                    </p>

            {/* Show any error or success messages */}
            {message && (
                <div className="rounded-md bg-red-50 mt-5 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                {message}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}