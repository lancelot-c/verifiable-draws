'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import React from "react";
import { loadStripe, StripeElementsOptions, PaymentIntent } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
// import CheckoutForm from "./CheckoutForm";
const websiteBasePaths = (process.env.NEXT_PUBLIC_APP_ENV === 'test') ? ['http://localhost:3000/ipfs?cid='] : ['http://verify.win/']
const stripePublicKey = (process.env.NEXT_PUBLIC_STRIPE_ENV === 'test') ? process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST : process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_PROD;

if (!stripePublicKey) {
    throw new Error("stripePublicKey is undefined")
}

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// const stripePromise = loadStripe(stripePublicKey);


const steps = [
    { name: 'Edit your draw details', href: '#step1' },
    // { name: 'Participants', href: '#step2' },
    { name: 'Schedule the random draw', href: '#step2' },
    // { name: 'Purchase', href: '#step4' },
    { name: 'Share the link', href: '#step3' },
]

type FormInputs = {
    step1?: {
        name: string
        rules: string,
        participants: string
        nbWinners: number
    },
    step2?: {
        scheduledAt: string
    },
    step3?: {

    },
}

const drawNamePlaceholder = 'My great contest';

const drawRulesPlaceholder =
`The participants for this contest are all the people who mentioned 2 of their friends in the comments of this Instagram post: https://www.instagram.com/p/Ct7jt-motWO6svTyXoQbbpDfU3F-kv6XTXXqEY0/
We will now randomly select one lucky winner among the participants.
This person will win a 2-week holiday to The Maldives.`;

const drawParticipantsPlaceholder = `@jeys23
@happy_lance
@mappingfestival
@sarah.bounab
@fit_fondation_
@cassandra_11.80
@elnaz_elie
@flyingjuliette
@27.horses
@_h_lo_
@julianinha_10
@myflixbox
@basile_schl
@walidpanerai
@fiorellacaye
@marieguillou_
@aline.hnh
@kwn_yayou
@dianafpc6155
@jaey.music
@mitch_schnitzbauer
@m.l.k._av
@carolineruchat
@gesinemar
@cyril_ratl
@marta82_pa
@lara.koch
@tsuki_lyn
@droux_ch
@piccasso_ink
@shay.gnv
@el.aldair
@sak0ch_
@s.e.b.a.7.7
@stasia.ds
@merylsup
@natalia_olszewskaa
@lucielogean
@henriboulet
@nico_zimmv
@poses_attitude
@ceciletyty
@itscamq
@nanahy
@low.maf
@itwasntk
@katia.cmrng
@el_dominicano.gnv
@nourskd
@chill_mlk
@benj.online
@meylinn.pr
@ajlaave_you
@aude456331
@sara_kkar
@crochetonique
@emman_wild
@cokoch
@vitg1234
@ceciilia_0949
@alexia_ratl
@melodymcv
@marieclaudebruchez
@monicafornes
@marion_florquin
@mister.idris
@estellebubu3005
@giusepperealennelcuore
@aloisius_gonzaga_agung`;

const drawNbWinnersPlaceholder = 1;



export default function Page() {

    const searchParams = useSearchParams()
    const dt_min = new Date();
    
    const safetyCushionMin = (process.env.NEXT_PUBLIC_APP_ENV === 'test') ? 0 : 0;
    const safetyCushionDefault = (process.env.NEXT_PUBLIC_APP_ENV === 'test') ? 0 : 10;
    dt_min.setMinutes(dt_min.getMinutes() - dt_min.getTimezoneOffset() + safetyCushionMin);

    const dt_default = new Date(dt_min);
    // dt_default.setMinutes(dt_min.getMinutes() - dt_min.getTimezoneOffset() + safetyCushionDefault);
    
    const scheduledAtMinValue = dt_min.toISOString().slice(0, 16);
    const scheduledAtDefaultValue = dt_default.toISOString().slice(0, 16);

    const { register, trigger, getValues, formState: { errors, isValid } } = useForm<FormInputs>({
        defaultValues: {
            step1: {
                name: '',
                rules: '',
                participants: '',
                nbWinners: drawNbWinnersPlaceholder
            },
            step2: {
                scheduledAt: scheduledAtDefaultValue
            }
        }
    });

    const showErrorsOnBlur = true
    type StepNumber = 1 | 2 | 3
    const startAtStep = 1
    // const paymentStep = 4
    const shareStep = 3

    const [currentStep, setCurrentStep] = useState<StepNumber>(startAtStep)
    const [selectedStep, setSelectedStep] = useState<StepNumber>(currentStep)
    const [clientSecret, setClientSecret] = useState<string>('');
    const [cid, setCid] = useState<string>('');
    const [deployError, setDeployError] = useState<string>('');
    const [deployInProgress, setDeployInProgress] = useState<boolean>(false);
    const [drawLinks, setDrawLinks] = useState<string[]>([]);
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | undefined>(undefined);
 
    // useEffect(() => {
    //     if (currentStep !== paymentStep) {
    //         return;
    //     }

    //     if (searchParams.has('code')) {
    //         nextStep(`step3`);
    //         return;
    //     }

    //     let ignore = false;

    //     fetch("/api/payment/create", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({}),
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             if (!ignore) {
    //                 setClientSecret(data.clientSecret)
    //             }
    //         });

    //     return () => {
    //         ignore = true;
    //     };

    // }, [currentStep])

    useEffect(() => {
        if (currentStep !== shareStep) {
            return;
        }

        let ignore = false;

        const [drawTitle, drawRules, drawParticipants, drawNbWinners] = getValues(["step1.name", "step1.rules", "step1.participants", "step1.nbWinners"]);
        const drawScheduledAt = Math.ceil(getTimestampFromIso(getValues("step2.scheduledAt")) / 1000); // in seconds
        setDeployInProgress(true);

        let jsonBody = {
            drawTitle,
            drawRules,
            drawParticipants,
            drawNbWinners,
            drawScheduledAt,
            code: '',
            paymentIntentId: ''
        };

        const hasCode = true; // replace by searchParams.has('code')

        if (hasCode) { 
            jsonBody.code = searchParams.get('code') as string;
        } else if (paymentIntent) {
            jsonBody.paymentIntentId = paymentIntent?.id as string;
        }

        fetch("/api/draw/deploy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonBody),
        })
            .then(res => res.json())
            .then(data => {
                if (!ignore) {

                    setDeployInProgress(false)

                    if (data.response.cid) {
                        setCid(data.response.cid);
                        setDrawLinks(websiteBasePaths.map(basePath => `${basePath}${data.response.cid}`))
                    }

                    if (data.error) {
                        setDeployError(data.error.message);
                    }

                }

            });

        return () => {
            ignore = true;
        };
    }, [currentStep, paymentIntent, getValues])

    function previousStep() {
        setSelectedStep(selectedStep - 1 as StepNumber)
    }

    async function nextStep(inputsToValidate: keyof FormInputs) {

        if (!isValid) {
            await trigger([inputsToValidate]);
            console.log(errors)
            return;
        }

        if (selectedStep + 1 > currentStep) {
            setCurrentStep(currentStep + 1 as StepNumber)
        }

        setSelectedStep(selectedStep + 1 as StepNumber)
    }

    function goToStep(stepNumber: StepNumber) {
        return () => {
            if (stepNumber > currentStep) {
                setCurrentStep(stepNumber)
            }

            setSelectedStep(stepNumber)
        }
    }


    // const options: StripeElementsOptions = {
    //     clientSecret,
    //     fonts: [{ cssSrc: 'https://fonts.googleapis.com/css?family=Inter' }],
    //     appearance: {
    //         theme: 'stripe',
    //         variables: {
    //             fontFamily: 'Inter',
    //             colorPrimary: '#4f46e5', // = Tailwind indigo-600 color
    //         },
    //         disableAnimations: false,
    //         labels: 'above'
    //     },
    //     loader: 'always',
    // };


    // async function onPaymentSuccess(paymentIntent: PaymentIntent) {

    //     const [drawTitle, drawRules, drawParticipants, drawNbWinners, drawScheduledAt] = getValues(["step1.name", "step1.rules", "step2.participants", "step2.nbWinners", "step3.scheduledAt"]);

    //     if (!drawTitle || !drawRules || !drawParticipants || !drawNbWinners || !drawScheduledAt) {
    //         return;
    //     }

    //     setPaymentIntent(paymentIntent)
    //     goToStep(5)();
    // }

    function validateScheduledAtFn() {
        return getTimestampFromIso(getValues("step2.scheduledAt")) >= getTimestampFromIso(scheduledAtMinValue)
    }

    // get timestamp in ms from partial iso string
    function getTimestampFromIso(iso: string) {
        const isoStr = `${iso}:00.000Z`;
        const date = new Date(isoStr);
        const timestampWithOffset = date.getTime();
        const offset = date.getTimezoneOffset() * 60 * 1000;
        const timestampWithoutOffset = timestampWithOffset + offset;
        return timestampWithoutOffset
    }

    function copyDrawLinkToClipboard(link: string) {
        navigator.clipboard.writeText(link).then(() => { }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function shortenUrl(url: string) {
        return url.replace('http://', '').replace('https://', '').replace('www.', '');
    }

    return (
        <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32 lg:px-8 min-h-full">

            {/* Background gradients */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>

            <div
                className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(20%)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>




            <h2 className="mt-0 text-4xl font-bold tracking-tight mb-16 text-gray-900 sm:text-5xl text-center">
                Launch a verifiable draw
            </h2>

            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {steps.map((step, index) => (
                        <li key={step.name} className="md:flex-1">
                            {selectedStep > index + 1 ? (
                                // Completed step
                                <Link
                                    href={step.href}
                                    onClick={goToStep(index + 1 as StepNumber)}
                                    className={`group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4
                                    ${isValid && selectedStep !== shareStep ? '' : 'pointer-events-none'}`}
                                >
                                    <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">Step {index + 1}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </Link>
                            ) : selectedStep === index + 1 ? (
                                // Ongoing step
                                <Link
                                    href={step.href}
                                    className="pointer-events-none flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                    aria-current="step"
                                >
                                    <span className="text-sm font-medium text-indigo-600">Step {index + 1}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </Link>
                            ) : currentStep >= index + 1 ? (
                                // Upcoming available step
                                <Link
                                    href={step.href}
                                    onClick={goToStep(index + 1 as StepNumber)}
                                    className={`group flex flex-col border-l-4 border-indigo-300 py-2 pl-4 hover:border-indigo-600 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4
                                    ${isValid ? '' : 'pointer-events-none'}`}
                                >
                                    <span className="text-sm font-medium text-indigo-300 group-hover:text-indigo-600">Step {index + 1}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </Link>
                            ) : (
                                // Upcoming unavailable step
                                <Link
                                    href={step.href}
                                    className="pointer-events-none group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                >
                                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Step {index + 1}</span>
                                    <span className="text-sm font-medium">{step.name}</span>
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Form */}
            <div className="mt-12">
                {
                    (selectedStep === 1) && (
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset sm:max-w-md">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder={drawNamePlaceholder}
                                            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                            ${errors.step1?.name && showErrorsOnBlur ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                            {...register("step1.name", {
                                                required: 'Name is required',
                                                onBlur: () => { trigger("step1.name"); },
                                            })}
                                        />
                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">This will be the title of the page we will create for your draw.</p>
                            </div>



                            <div className="col-span-full">
                                <label htmlFor="rules" className="block text-sm font-medium leading-6 text-gray-900">
                                    Rules
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        rows={10}
                                        id="rules"
                                        placeholder={drawRulesPlaceholder}
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                        ${errors.step1?.rules && showErrorsOnBlur ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                        {...register("step1.rules", {
                                            required: 'Rules are required',
                                            onBlur: () => { trigger("step1.rules"); },
                                        })}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Explain what people needed to do in order to participate in this draw.</p>
                            </div>



                            <div className="col-span-full">
                                <label htmlFor="participants" className="block text-sm font-medium leading-6 text-gray-900">
                                    List of participants
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        rows={10}
                                        id="participants"
                                        placeholder={drawParticipantsPlaceholder}
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                        ${errors.step1?.participants && showErrorsOnBlur ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                        {...register("step1.participants", {
                                            required: 'List of participants is required',
                                            onBlur: () => { trigger("step1.participants"); },
                                        })}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    Type one username per line.<br />
                                    If you want some participants to have twice more chance of winning, just enter their usernames twice in two separate lines.
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="nbWinners" className="block text-sm font-medium leading-6 text-gray-900">
                                    Number of winners
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        id="nbWinners"
                                        min="0"
                                        placeholder={drawNbWinnersPlaceholder.toString()}
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                                        ${errors.step1?.nbWinners && showErrorsOnBlur ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                        {...register("step1.nbWinners", {
                                            required: 'Number of participants to draw is required',
                                            onBlur: () => { trigger("step1.nbWinners"); },
                                        })}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">This is the number of participants that the algorithm will randomly select.</p>
                            </div>

                        </div>
                    )
                }


                {/* {
                    (selectedStep === 2) && (
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                            
                        </div>
                    )
                } */}

                {
                    (selectedStep === 2) && (
                        <div className="mt-10">

                            <div className="text-center">
                                <label htmlFor="scheduledAt" className="block text-sm font-normal leading-6 text-gray-900">
                                Choose the date and time at which the random draw will happen.<br />
                                ({(Intl.DateTimeFormat().resolvedOptions().timeZone)} time zone detected)
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="datetime-local"
                                        id="scheduledAt"
                                        min={scheduledAtMinValue}
                                        className={`block m-auto rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                                        ${errors.step2?.scheduledAt && showErrorsOnBlur ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                        {...register("step2.scheduledAt", {
                                            required: 'Scheduled date and time is required',
                                            validate: validateScheduledAtFn,
                                            onBlur: () => { trigger("step2.scheduledAt"); },
                                        })}
                                    ></input>
                                </div>
                            </div>

                            <div className="rounded-md bg-blue-50 p-4 mt-8">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3 flex-1 md:flex md:justify-between">
                                        <p className="text-sm text-blue-700">
                                            We recommend you to choose a date and time a few minutes in the future, so that the draw participants will be able to see the random draw in live on the blockchain when it happens.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                }

                {/* Payment step, hidden by default but needs to always be in the DOM
                to prevent re-rendering when the user switch between steps */}
                {/* <div className={`flex flex-wrap justify-center justify-items-center items-center mt-10 w-full ${selectedStep === paymentStep ? '' : 'hidden'}`}>

                    <p className="max-w-[600px] mt-0 px-8 sm:px-24 py-16 border-b lg:border-b-0 lg:border-r border-gray-200 text-md font-light tracking-wide text-gray-800 sm:text-md text-center">
                        Because it is end-to-end decentralized, <span className="italic">Verifiable Draws</span> is the only draw platform which prevents all kinds of fraud.
                        <br /><br />
                        Therefore, by choosing us, you are contributing to make the world a better place and inspiring others to do the same.
                        <br /><br />
                        This is the last step before deploying your draw.<br />
                        The decentralized world awaits you. ✨
                    </p>

                    <div className="min-w-[300px] max-w-[800px] flex-auto px-8 sm:px-24 py-16">
                        <p className="mt-0 text-xl font-normal tracking-tight sm:mb-4 text-gray-800 sm:text-xl text-center">
                            Purchase a single draw
                        </p>

                        <p className="mt-0 text-base font-normal tracking-tight sm:mb-4 text-gray-800 sm:text-base text-center">
                            Total: 29,00€
                        </p>

                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <CheckoutForm onPaymentSuccess={onPaymentSuccess} />
                            </Elements>
                        )}
                    </div>

                </div> */}

                {
                    (selectedStep === 3) && (
                        <div className="mt-10">

                            {/* <div className="rounded-md bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">Payment successful</p>
                                    </div>
                                </div>
                            </div> */}

                            
                            
                            {
                                (deployInProgress) && (

                                    <div className="rounded-md bg-yellow-50 p-4 mt-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="orange" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Deploying the draw on IPFS and Ethereum.
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <p>
                                                        This action generally takes about a minute, please wait without closing the page.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }


                            {
                                (cid && deployError) && (

                                    <div className="rounded-md bg-green-50 p-4 mt-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-green-800">Draw successfully uploaded to verify.win/{ cid }</p>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }


                            {
                                (deployError) && (
                                    
                                    <div className="rounded-md bg-red-50 p-4 mt-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-red-800">
                                                    { deployError }<br />
                                                    { (cid) ? 'Please send us the above IPFS link' : 'Please contact us' } using the chat at the bottom-right of this page so that we can investigate what went wrong.<br />
                                                    We apologize for the inconvenience.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                )
                            }

                                {
                                    (drawLinks.length > 0 && !deployError) && (
                                    <div className="text-center">
                                        <p className="mt-8 text-md">
                                            Your draw has successfully been deployed on IPFS & Ethereum. 🎉<br />
                                            You can now share the following IPFS link with the participants so that they can access the draw results in trustless way.
                                        </p>


                                        {drawLinks.map((drawLink) => (
                                            <div key={drawLink} className="rounded-md bg-white/50 ring-2 ring-indigo-800 my-12 px-8 py-4 text-xl flex justify-center">
                                                <div className="text-ellipsis overflow-hidden mx-2">
                                                    { shortenUrl(drawLink) }
                                                </div>

                                                <Link href={drawLink} rel="noopener" target="_blank" className="mx-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>
                                                </Link>

                                                <div onClick={() => { copyDrawLinkToClipboard(drawLink) }} className="cursor-pointer mx-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                                    </svg>
                                                </div>
                                            </div>
                                        ))}

                                        <p className="mt-8 text-md">
                                            If you need further assistance please ask on <Link href="https://discord.gg/3YjqW9MP7H" rel="noopener" target="_blank" className="underline">our Discord server</Link>, we will be happy to help you.<br />
                                            Thank you for using our service and helping to make the world more decentralized and transparent.
                                        </p>
                                    </div>
                                )
                            }

                        </div>
                    )
                }

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    {
                        (selectedStep > 1 && selectedStep < steps.length) && (
                            <button
                                onClick={previousStep}
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                Back
                            </button>
                        )
                    }
                    {
                        (selectedStep < steps.length) && (
                            <button
                                type="button"
                                onClick={async () => { await nextStep(`step${selectedStep}`) }}
                                className={`rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                                ${isValid ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-300 pointer-events-none'}`}
                            >
                                Continue
                            </button>
                        )
                    }
                    {
                        (selectedStep === steps.length && drawLinks.length > 0) && (
                            <Link href="/">
                                <button
                                    type="button"
                                    className="rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
                                >
                                    Finish
                                </button>
                            </Link>
                        )
                    }
                </div>

            </div>

        </div>
    )
}