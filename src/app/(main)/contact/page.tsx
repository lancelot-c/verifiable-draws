"use client"
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { Switch } from '@headlessui/react'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type FormInputs = {
    firstName: string,
    lastName: string,
    company: string,
    email: string,
    phone: string,
    message: string
}

const firstNamePlaceholder = ''
const lastNamePlaceholder = ''
const companyPlaceholder = ''
const emailPlaceholder = ''
const phonePlaceholder = ''
const messagePlaceholder = ''

export default function Example() {
    const [agreed, setAgreed] = useState(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [sent, setSent] = useState<boolean>(false)

    const { register, trigger, getValues, formState: { errors, isValid } } = useForm<FormInputs>({
        defaultValues: {
            firstName: '',
            lastName: '',
            company: '',
            email: '',
            phone: '',
            message: ''
        }
    });


    useEffect(() => {
        if (!submitted) {
            return;
        }

        let ignore = false;

        const [firstName, lastName, company, email, phone, message] = getValues(["firstName", "lastName", "company", "email", "phone", "message"]);


        try {

            fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    company,
                    email,
                    phone,
                    message
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (!ignore) {

                        if (data.errorMessage) {
                            setErrorMessage(data.errorMessage);
                        } else {
                            setSent(true)
                        }
                        
                    }

                });

        } catch (error: any) {
            console.error(error);
            setErrorMessage('An error occured while sending your message. Please try again later.');
        }

        return () => {
            ignore = true;
        };
    }, [submitted, getValues]);


    return (
        <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
                aria-hidden="true"
            >
                <div
                    className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                />
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Get in touch
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                    Tell us more about your needs. We usually reply back within 48h.
                </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                id="first-name"
                                autoComplete="given-name"
                                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                ${errors.firstName ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                {...register("firstName", {
                                    required: 'First name is required',
                                    onBlur: () => { trigger("firstName"); },
                                })}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                id="last-name"
                                autoComplete="family-name"
                                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                                ${errors.lastName ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                {...register("lastName", {
                                    required: 'Last name is required',
                                    onBlur: () => { trigger("lastName"); },
                                })}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="company" className="block text-sm font-semibold leading-6 text-gray-900">
                            Company
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text"
                                id="company"
                                autoComplete="organization"
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                {...register("company", {
                                    onBlur: () => { trigger("company"); },
                                })}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                            Email
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="email"
                                id="email"
                                autoComplete="email"
                                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                ${errors.email ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                {...register("email", {
                                    required: 'Email is required',
                                    onBlur: () => { trigger("email"); },
                                })}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-900">
                            Phone number
                        </label>
                        <div className="relative mt-2.5">
                            <div className="absolute inset-y-0 left-0 flex items-center">
                                <label htmlFor="country" className="sr-only">
                                    Country
                                </label>
                                <select
                                    id="country"
                                    name="country"
                                    className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                                >
                                    <option>US</option>
                                    <option>CA</option>
                                    <option>EU</option>
                                </select>
                                <ChevronDownIcon
                                    className="pointer-events-none absolute right-3 top-0 h-full w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                type="tel"
                                id="phone-number"
                                autoComplete="tel"
                                className="block w-full rounded-md border-0 px-3.5 py-2 pl-20 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                {...register("phone", {
                                    onBlur: () => { trigger("phone"); },
                                })}
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                            Message
                        </label>
                        <div className="mt-2.5">
                            <textarea
                                id="message"
                                rows={8}
                                className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6
                                ${errors.message ? 'ring-red-600' : 'focus:ring-indigo-600'}`}
                                {...register("message", {
                                    required: 'Message is required',
                                    onBlur: () => { trigger("message"); },
                                })}
                            />
                        </div>
                    </div>
                    <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
                        <div className="flex h-6 items-center">
                            <Switch
                                checked={agreed}
                                onChange={setAgreed}
                                className={classNames(
                                    agreed ? 'bg-indigo-600' : 'bg-gray-200',
                                    'flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                )}
                            >
                                <span className="sr-only">Agree to policies</span>
                                <span
                                    aria-hidden="true"
                                    className={classNames(
                                        agreed ? 'translate-x-3.5' : 'translate-x-0',
                                        'h-4 w-4 transdiv rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out'
                                    )}
                                />
                            </Switch>
                        </div>
                        <Switch.Label className="text-sm leading-6 text-gray-600">
                            By selecting this, you agree to our{' '}
                            <a href="#" className="font-semibold text-indigo-600">
                                privacy&nbsp;policy
                            </a>
                            .
                        </Switch.Label>
                    </Switch.Group>
                </div>
                <div className="mt-10">
                    <button
                        onClick={() => { setSubmitted(true) }}
                        className={`block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                        ${(isValid && !submitted) ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-300 pointer-events-none'}`}
                    >
                        Send
                    </button>
                </div>

                {
                    (sent) && (
                        
                        <div className="rounded-md bg-green-50 p-4 mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">Thank you for your message.</p>
                                </div>
                            </div>
                        </div>

                    )
                }


                {
                    (errorMessage) && (
                        
                        <div className="rounded-md bg-red-50 p-4 mt-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{ errorMessage }</p>
                                </div>
                            </div>
                        </div>

                    )
                }

            </div>
        </div>
    )
}
