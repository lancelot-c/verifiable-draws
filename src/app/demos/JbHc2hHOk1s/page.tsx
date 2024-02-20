'use client'
import { useRef, useEffect, useState, Fragment } from 'react';
import Image from 'next/image'
import React from "react";
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import lotteryBallsImg from '/public/img/lottery-balls.png'
import { Fireworks } from '@fireworks-js/react'
import type { FireworksHandlers } from '@fireworks-js/react'
const network = 'polygon-mainnet';
const contractAddress = '0x53aFbA99a9850Db9A203c4Af4A593e9021d18389';


export default function Page() {

    const [newDrawClicked, setNewDrawClicked] = useState<boolean>(false)
    const [deployInProgress, setDeployInProgress] = useState<boolean>(false);
    const [drawInProgress, setDrawInProgress] = useState<boolean>(false);
    const [displayFireworks, setDisplayFireworks] = useState<boolean>(false);
    const [cid, setCid] = useState<string>('');
    const [nbResultChecks, setNbResultChecks] = useState<number>(0);
    const [deployError, setDeployError] = useState<string>('');
    const [open, setOpen] = useState(false)
    const [winners, setWinners] = useState<string[] | undefined>(undefined);
    const drawNbWinners = 5;
    // let fireworksElmt: any;
    // let fireworks: any;
    const ref = useRef<FireworksHandlers>(null)


    useEffect(() => {
        if (!newDrawClicked) {
            return;
        }

        setDrawInProgress(true)
        setDeployInProgress(true);
        let ignore = false;

        const drawTitle = '✨ The most transparent lottery of all time ✨';
        const drawRules = '5 numbers between 1 and 49 will be selected randomly';
        let drawParticipants = '';

        for (let i = 1; i <= 49; i++) {
            drawParticipants += `${i}\n`;
        }

        const drawScheduledAt = Math.floor(Date.now() / 1000); // in seconds

        let jsonBody = {
            code: 'arandomlotterycompany',
            drawTitle,
            drawRules,
            drawParticipants,
            drawNbWinners,
            drawScheduledAt
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
                    }

                    if (data.error) {
                        setDeployError(data.error.message);
                    }

                }

            });

        return () => {
            ignore = true;
        };
    }, [newDrawClicked])
                            

    useEffect(() => {
        if (!cid || winners) {
            return;
        }

        let ignore = false;

        setTimeout(() => {

            fetch(`https://www.verifiabledraws.com/api/smart-contract/getWinners?network=${network}&contractAddress=${contractAddress}&cid=${cid}`)
                .then(res => res.json())
                .then(data => {
                    if (!ignore) {

                        const winners = data.winners;
                        const hasWinners = Array.isArray(winners) && winners.length > 0;

                        if (hasWinners) {

                            console.log(`winners = ${winners}`);
                            setDrawInProgress(false)
                            setWinners(winners);

                            setDisplayFireworks(true)
                            setTimeout(() => {
                                setDisplayFireworks(false)
                            }, 6000);
                        }
                        
                        setNbResultChecks(nbResultChecks+1);
                    }
                });

        }, 10000);

        

        return () => {
            ignore = true;
        };
    }, [cid, nbResultChecks, winners])


    function newDraw() {
        setNewDrawClicked(true)
    }

    function openModal() {
        setOpen(true)
    }

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    // async function periodicallyCheckDrawResult() {
    //     const winners = await checkDrawResult();
    //     const hasWinners = Array.isArray(winners) && winners.length > 0;

    //     if (hasWinners) {

    //         setDrawInProgress(false)
    //         setWinners(winners);

    //         setDisplayFireworks(true)
    //         setTimeout(() => {
    //             setDisplayFireworks(false)
    //         }, 3000);



    //     } else {
    //         setTimeout(() => {
    //             periodicallyCheckDrawResult();
    //         }, 10000);
    //     }
    // }

    // const checkDrawResult = async () => {

    //     // You can verify that the returned randomness match the one at {{ polygonscanAddress }}/address/{{ contractAddress }}#readContract#F5
        
        
    // }


    // async function displayWinners(winners: string[]) {
    //     console.log(`We have some winners 🎉`);
    //     loadingElmt.style.display = 'none';
    //     scheduledAtElmt.style.display = 'none';
    //     occuredAtElmt.style.display = 'block';

    //     // Launch fireworks animation
    //     // fireworksElmt = document.querySelector('.fireworks');
    //     // fireworks = new Fireworks.default(fireworksElmt);
    //     // launchFireworks(10, 100);

    //     const winnersElement = document.getElementsByClassName("winners")[0];
    //     const winnersListElement = winnersElement.getElementsByClassName("winners__list")[0];
    //     const winnersPluralElement = winnersElement.getElementsByClassName("plural-winners")[0];

    //     if (winners.length > 1) {
    //         winnersPluralElement.innerHTML = 's';
    //     }
        
    //     winnersElement.style.display = 'block';


    //     winners.forEach(winner => {
    //         winnersListElement.innerHTML += `<li>${drawParticipants[winner-1]}</li>`;
    //     });
    // }

    // function launchFireworks(nb: number, delay: number, first = true) {

    //     if (first && nb > 0) {
    //         fireworksElmt.style.display = 'block';
    //         fireworks.launch(1);
    //         nb--;
    //     }

    //     if (nb > 0) {

    //         setTimeout(() => {
    //             fireworks.launch(1);
    //             nb--;
    //             launchFireworks(nb, delay, false);
    //         }, delay);

    //     }

    //     if (nb == 0) {
    //         setTimeout(() => {
    //             fireworksElmt.style.display = 'none';
    //         }, 2000);
    //     }
    // }

    // function toggleFireworks() {
    //     if (!ref.current) return
    //     if (ref.current.isRunning) {
    //       ref.current.stop()
    //     } else {
    //       ref.current.start()
    //     }
    // }


    return (
        <div className="mx-auto max-w-7xl px-6 pt-24 sm:pt-32 lg:px-8 min-h-full">


            <p className="mt-0 text-xl font-normal tracking-tight mb-16 text-gray-900 sm:text-lg text-center">
                Because transparency matters to our clients,<br />we have created the first online lottery which is 100% transparent. ✨
            </p>

            
                    
            <div
                        className={classNames(
                            newDrawClicked ? '' : 'hover:border-gray-400',
                            winners ? 'border-gray-700' : 'border-dashed border-gray-300',
                            'relative block m-auto w-1/2 rounded-lg border-2 p-12 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                        )}
                    >
            {
                (!newDrawClicked) && (
                    
                        <button type="button" onClick={() => { newDraw() }}>
                            <Image
                                className="w-28 m-auto"
                                src={lotteryBallsImg}
                                alt="Lottery balls"
                            />

                            <span className="mt-2 block text-sm font-semibold text-gray-900">New lottery drawing</span>
                        </button>
                )
            }


<div className="p-2 max-w-sm w-full mx-auto">
                        {
                (drawInProgress) && (

                    
                        <div className="flex justify-center items-center space-x-2">
                            <svg className="animate-spin mr-3 mt-1 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#6d7a8f" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="#6d7a8f" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            
                            <span className="text-gray-600">
                                Draw in progress, please wait a minute...
                            </span>
                            

                            {/* {
                                [undefined, undefined, undefined, undefined, undefined].map(() => (
                                    <div className="rounded-full bg-slate-200 h-10 w-10"></div>


                                    
                                ))
                            } */}
                        </div>

                        

                )
            }



                        {
                            (winners) && (
                                <div>
                                    <div className="mb-4">The winning numbers for this draw are</div>
                                    <div className="flex justify-evenly mb-4">
                                        {winners.map((winner) => (
                                            <div key={winner} className="rounded-full bg-slate-700 text-white h-10 w-10 pt-2">
                                                {winner}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

{
                            (cid) && (
                                <button type="button" onClick={() => { openModal() }} className="mt-8 text-xs text-center w-full leading-5 text-gray-500 md:order-1 md:mt-0 underline hover:text-gray-600">
                                    Check this draw on the blockchain
                                </button>
                            )
                        }
                        
                    </div>

</div>
                





                    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Check this draw on the blockchain
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        All lotteries claim that they are random but you cannot be sure about it because they perform their draws in a non-verifiable way.<br /><br />
                        We perform all of our draws on the blockchain to make sure they are provably random and verifiable by anyone.<br /><br />To verify the winners for this draw, simply <Link href="https://polygonscan.com/address/0x53aFbA99a9850Db9A203c4Af4A593e9021d18389#readContract#F7" target="_blank" className="underline hover:text-gray-500">go to the Verifiable Draws smart contract</Link> and call the function <code className="bg-[#eff1f2] m-0 py-1 px-2 rounded-md whitespace-break-spaces break-words">getWinners</code> with <code className="bg-[#eff1f2] m-0 py-1 px-2 rounded-md whitespace-break-spaces break-words">{ cid }</code> which is the identifier for this draw.
                        {/* padding: 0.2em 0.4em;
                        margin: 0;
                        white-space: break-spaces;
                        background-color: rgba(175, 184, 193, 0.2);
                        border-radius: 6px; */}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    OK
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>


{
    (displayFireworks) && (
<Fireworks
        ref={ref}
        options={{ opacity: 0.5 }}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
        }}
      />
    )
}

    

            

        </div>
    )
}