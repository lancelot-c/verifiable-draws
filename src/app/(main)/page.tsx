import Link from 'next/link'
import Image from 'next/image'
import goldMedalImg from '/public/img/medaille-or-lepine-500w.png'
import mainHeroImg from '/public/img/world-hero.webp'
import lepineStandImg from '/public/img/lepine-stand.jpeg'
import lepineRemisePrixImg from '/public/img/lepine-photo-officielle-cropped.jpeg'
import insightMediaImg from '/public/img/insight-media.png'
import giveawayImg from '/public/img/giveaway.webp'
import lotteryImg from '/public/img/lottery-ticket.jpeg'
import olympicGamesImg from '/public/img/fifa-draw.jpeg'
import featuresBadImg from '/public/img/features-bad.png'
import featuresCoolImg from '/public/img/features-cool.png'
import casinoMachineImg from '/public/img/text-to-win.webp'
import fdjLogoImg from '/public/img/fdj-logo-300w.png'
import insightMediaLogoImg from '/public/img/insight-media-logo.png'
import morningLogoImg from '/public/img/morning-logo.png'
import ipfsLogoImg from '/public/img/ipfs-logo-without-text.svg'
import tf1LogoImg from '/public/img/tf1-logo-300w.png'
import ethereumLogoImg from '/public/img/ethereum-logo-100w.png'
import chainlinkLogoImg from '/public/img/chainlink-logo-100w.png'
import fidealisLogoImg from '/public/img/fidealis-logo-300w.png'
import kastelCoLogoImg from '/public/img/kastel-co-logo-300w.png'
import kimLogoImg from '/public/img/kim-kardashian.jpg'
import fifaLogoImg from '/public/img/fifa-logo.png'
import mcdonaldsLogoImg from '/public/img/McDonalds-logo.png'
import bbcLogoImg from '/public/img/bbc-logo.webp'

import {
    ScaleIcon,
    CheckIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    SparklesIcon,
    CursorArrowRaysIcon,
    UserGroupIcon,
    ArrowTopRightOnSquareIcon,
    GlobeEuropeAfricaIcon
} from '@heroicons/react/24/solid'


const features = [
    {
        name: 'Provably fair and random',
        description:
            'Rely on an algorithm secured by cryptographic proofs which cannot be manipulated by anyone, not even by us.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Top notch brand image',
        description:
            'Boost your brand image by using a transparent algorithm and showing your users that transparency matters to you.',
        icon: SparklesIcon,
    },
    {
        name: 'Say goodbye to disputes',
        description:
            'Prevent anyone from challenging your draw results by displaying easy-to-verify proofs which certify that your draws are performed in a fair and random way.',
        icon: ScaleIcon,
    },
    {
        name: 'Better user experience',
        description:
            'Empower your participants by letting them follow the draw in real time through a customized web page.',
        icon: CursorArrowRaysIcon,
    },
    {
        name: 'Increased engagement',
        description:
            'Grow your user base by ensuring trustworthy and fair outcomes that are verifiable.',
        icon: UserGroupIcon,
    },
    {
        name: 'GDPR compliant',
        description:
            'No personal data is stored onchain as the list of participants is only held by us on our private IPFS gateway.',
        icon: GlobeEuropeAfricaIcon,
    },
]

const featuresBad = [
    {
        name: 'No proof.',
        description:
            'The participants don\'t have a proof certifying that the draw was performed in a fair and random way, they have to take the organizer\'s word for it.',
        icon: ShieldExclamationIcon,
    },
    {
        name: 'Fake security.',
        description:
            'Most random draw websites are not open-source, and even when they are, it does not guarantee that the open-sourced code is the actual code that is running on the website. Therefore these websites are unverifiable and can\'t be trusted.',
        icon: ShieldExclamationIcon,
    },
    {
        name: 'Easy to manipulate.',
        description:
            'Most solutions don\'t tell how they generate randomness or they rely on centralized services like random.org. It is extremely easy for these services to send you a malicious random number and you won\'t be able to detect it.',
        icon: ShieldExclamationIcon,
    },
]

const hallOfShame = [
    {
        name: 'Kim Kardashian sued for fake lottery scam on Instagram',
        image: kimLogoImg,
        website: 'TMZ',
        url: 'https://www.tmz.com/2022/09/15/kim-kardashian-scott-disick-sued-scam-lottery-lawsuit/'
    },
    {
        name: 'Michel Platini admits the World Cup 98 draw was rigged',
        image: fifaLogoImg,
        website: 'The Washington Post',
        url: 'https://www.washingtonpost.com/news/early-lead/wp/2018/05/18/former-uefa-boss-michel-platini-says-1998-world-cup-draw-was-fixed/'
    },
    {
        name: 'McDonald\'s fooled on its own lucky draw game for more than 10 years',
        image: mcdonaldsLogoImg,
        website: 'Daily Beast',
        url: 'https://www.thedailybeast.com/how-an-ex-cop-rigged-mcdonalds-monopoly-game-and-stole-millions'
    },
    {
        name: 'BBC fined by regulators for fake quizzes and contests',
        image: bbcLogoImg,
        website: 'Reuters',
        url: 'https://www.reuters.com/article/us-britain-bbc-idUSL065561320080730'
    }
]

const featuresCool = [
    {
        name: 'Provably fair results.',
        description:
            'The draw organizer shares the URL of the draw with the participants who can then check the results by themselves without having to trust anyone. Because the draw is end-to-end verifiable, they have a proof that the winners were selected in a fair and random way.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Decentralized frontend.',
        description:
            'The draw details are gathered in a single html file that is stored on IPFS and is accessible at verify.win/<IPFS-CID>. When the draw occurs, the webpage automatically retrieve the winners from the smart contract and display them to the user.',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Onchain verifiable randomness.',
        description:
            'The winners are randomly picked in our smart contract using Chainlink VRF which provides cryptographically secure randomness for your draw. No personal data is leaked during this process as the participants are anonymized onchain.',
        icon: ShieldCheckIcon,
    },
]


const useCases = [
    {
        id: 1,
        title: 'Social media giveaways',
        href: '#',
        description:
            'Increase the engagement on your giveaways by displaying a full transparency of the winner selection process.',
        imageUrl: giveawayImg
    },
    {
        id: 2,
        title: 'TV contests',
        href: '#',
        description:
            'Stand out from your competitors and regain the public interest in your TV Shows by letting your viewers know that your contests are transparent and secure thanks to blockchain technology.',
        imageUrl: casinoMachineImg
    },
    {
        id: 3,
        title: 'Lotteries',
        href: '#',
        description:
            'Add transparency and best in class security to your lottery by selecting the winning numbers with a verifiable draw that anyone can audit.',
        imageUrl: lotteryImg
    },
    {
        id: 4,
        title: 'Championships',
        href: '#',
        description:
            'Most championships, like the Olympic games and the FIFA World Cup, are using random draws to decide competition brackets. Make this process verifiable to prevent corruption.',
        imageUrl: olympicGamesImg
    },
    //   {
    //     id: 5,
    //     title: 'Public entities',
    //     href: '#',
    //     description:
    //       'Increase the trust in your public institutions by proving to your citizens that you are not corrupted.',
    //     imageUrl: publidGoodsImg
    //   },
    //   {
    //     id: 6,
    //     title: 'Custom',
    //     href: '#',
    //     description:
    //       'Random draw is one of the oldest algorithm on Earth',
    //     imageUrl: publidGoodsImg
    //   }
]


const videos = [
    {
        description: 'Watch our founder Lancelot Chardonnet pitch the project at Concours Lépine [in French]',
        imageUrl: lepineStandImg,
        videoUrl: 'https://www.youtube.com/watch?v=JbHc2hHOk1s',
    },
    {
        description: 'Watch the ending ceremony of Concours Lépine [in French]',
        imageUrl: lepineRemisePrixImg,
        videoUrl: 'https://www.youtube.com/watch?v=4oVa9vfy-cE',
    },
    {
        description: 'Watch Insight Media\'s video about Verifiable Draws [in French]',
        imageUrl: insightMediaImg,
        videoUrl: 'https://www.linkedin.com/posts/insightch_algorithme-blockchain-activity-7092194795837603841-J68n',
    }
]

const tiers = [
    {
        name: 'Hobby',
        id: 'tier-hobby',
        href: '/launch-draw',
        price: '$0',
        description: 'Try the most secure random draw algorithm currently on the market for free.',
        features: [
            { included: true, text: 'Up to 10,000 participants' },
            { included: true, text: 'Up to 100 winners' },
            { included: true, text: 'Deployed on Arbitrum Sepolia testnet' },
            { included: true, text: 'Accessible on our IPFS gateway verify.win' },
        ],
        mostPopular: false,
        cta: 'Launch draw',
    },
    {
        name: 'Startup',
        id: 'tier-pro',
        href: '/launch-draw',
        price: '$9',
        description: 'Deploy on the open web: trustless, censorship resistant, and free of centralized gatekeepers.',
        features: [
            { included: true, text: 'Up to 1,000,000 participants' },
            { included: true, text: 'Up to 500 winners' },
            { included: true, text: 'Deployed on Arbitrum One mainnet' },
            { included: true, text: 'Accessible on our IPFS gateway verify.win' },
            { included: true, text: 'Accessible on all public IPFS gateways' },
            { included: true, text: 'Support on our Discord' },
        ],
        mostPopular: true,
        cta: 'Coming soon',
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        href: '/contact',
        price: 'Custom',
        description: 'We provide custom plans for companies engaged in large-scale operations.',
        features: [
            // { included: true, text: 'Unlimited draws' },
            { included: true, text: 'Unlimited participants' },
            { included: true, text: 'Unlimited winners' },
            { included: true, text: 'Deployed on Arbitrum One mainnet' },
            { included: true, text: 'Accessible on our IPFS gateway verify.win' },
            { included: true, text: 'Accessible on all public IPFS gateways' },
            { included: true, text: 'White-labelling, bring your own template' },
            { included: true, text: 'API access' },
            { included: true, text: '24/7 priority support' },
        ],
        mostPopular: false,
        cta: 'Contact sales',
    }
]



function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}


export default function Example() {

    // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <div className="relative -z-10">

            {/* Hero section */}
            <div className="relative pt-14">
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
                <div className="py-0 pt-16 sm:pt-24 lg:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                The ultimate<br />randomness provider
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                <span className="italic">Verifiable Draws</span> provides your offchain applications with onchain verifiable randomness, unlocking the maximum level of security and transparency for your users.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href="/launch-draw"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Launch Draw
                                </Link>

                                <Link href="https://www.verify.win/bafybeiaq2k27yhlvtyxiye67afah5zziadlpzy6hf6nnsgulqase6p3d6u" className="text-sm font-semibold leading-6 text-gray-900">
                                    View an example <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* <div className="mt-16 flow-root sm:mt-24">
                            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                                <Image
                                    sizes="94vw"
                                    src={mainHeroImg}
                                    alt="App screenshot"
                                    className="rounded-md shadow-2xl ring-1 ring-gray-900/10"
                                />
                            </div>
                        </div> */}

                    </div>
                </div>
                <div
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
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
            </div>

            {/* Logo cloud */}
            <div className="mx-auto max-w-7xl pt-32 px-6 lg:px-8 lg:pt-0">
                <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5  grayscale-[90%]">
                    
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src={insightMediaLogoImg}
                        alt="Insight Media"
                    />

                    <Image
                        className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                        src={morningLogoImg}
                        alt="Morning"
                    />

                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src={fdjLogoImg}
                        alt="FDJ"
                    />

                    <Image
                        className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                        src={tf1LogoImg}
                        alt="TF1"
                    />
                    
                    <Image
                        className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                        src={fidealisLogoImg}
                        alt="Fidealis"
                    />
                </div>
                {/* <div className="mt-16 flex justify-center">
            <p className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/10 hover:ring-gray-900/20">
              <span className="hidden md:inline">
                Transistor saves up to $40,000 per year, per employee by working with us.
              </span>
              <Link href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" /> Read our case study{' '}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </p>
          </div> */}
                {/* <h2 className="mt-16 text-center text-lg font-semibold leading-8 text-gray-900">
                    These companies have expressed their interest in our product
                </h2> */}
            </div>



            {/* Feature section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
                <div className="mx-auto max-w-xl text-center">
                    {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Stop using shady software</h2> */}
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Meet the Holy Grail of random draw algorithms
                    </h2>
                    {/* <p className="mt-6 text-lg leading-8 text-gray-600">
                        The only proven way to get random draws that are 100% reliable.
                    </p> */}
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>




            <div className="bg-white mt-32 sm:mt-56">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
                        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Current random draw solutions are vulnerable to malicious attacks
                        </h2>
                        {/* <p className="mt-6 text-lg leading-8 text-gray-600">
                            Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
                            pulvinar et feugiat blandit at. In mi viverra elit nunc.
                        </p> */}
                    </div>

                    <div className="relative overflow-hidden pt-16">
                        <div className="mx-auto max-w-7xl px-0 lg:px-8">
                            <Image
                                src={featuresBadImg}
                                alt=""
                                className="w-full rounded-2xl bg-gray-100 object-cover"
                            />
                        </div>
                    </div>


                    <div className="mx-auto mt-8 max-w-2xl sm:mt-16 sm:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-16 gap-y-8 sm:max-w-none sm:grid-cols-3">
                            {featuresBad.map((feature) => (
                                <div key={feature.description} className="relative pl-9">
                                    <dt className="inline text-base font-semibold leading-7 text-gray-900">
                                        <feature.icon className="absolute left-1 top-1 h-5 w-5 text-[#ea6a5d]" aria-hidden="true" />
                                        {feature.name}
                                    </dt>{' '}
                                    <dd className="inline text-base leading-7 text-gray-600">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>


                </div>
            </div>



            <div className="bg-white py-24 sm:py-32 mt-32 sm:mt-46">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:max-w-none">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                Scams and attacks happen all the time
                            </h1>
                            <p className="mt-4 text-lg leading-8 text-gray-600">
                                Here are just a few cases where people didn&apos;t use Verifiable Draws and got in trouble.
                            </p>
                        </div>
                        <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                            {hallOfShame.map((company, index) => (
                                <div key={company.name} className="flex flex-col items-center bg-[#ea6a5d] p-8">
                                    <div>
                                        <Image
                                            src={company.image}
                                            alt=""
                                            className={`object-scale-down h-24 ${ index === 0 ? 'rounded-full w-24' : 'w-36'}`}
                                        />
                                    </div>

                                    <div className="text-xl font-semibold tracking-tight text-white mt-4">{company.name}</div>
                                    
                                    <Link href={company.url} target="_blank" className="flex items-center justify-center hover:underline text-xs font-semibold leading-6 text-white mt-2">
                                        {company.website}
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4 inline ml-1" aria-hidden="true" />
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg> */}
                                    </Link>
                                </div>
                            ))}
                        </dl>
                        <div className="text-center">
                            <p className="mt-16 text-lg leading-8 text-gray-600">
                                Stay safe, secure your draws with Verifiable Draws.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>




            <div className="bg-white mt-32 sm:mt-56">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2> */}
                        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Verifiable Draws eliminates the risks of traditional random draw solutions
                        </h2>
                        {/* <p className="mt-6 text-lg leading-8 text-gray-600">
                            Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
                            pulvinar et feugiat blandit at. In mi viverra elit nunc.
                        </p> */}
                    </div>

                    <div className="relative overflow-hidden pt-8 lg:pt-16">
                        <div className="mx-auto max-w-7xl px-0 lg:px-8">
                            <Image
                                src={featuresCoolImg}
                                alt=""
                                className="w-full rounded-2xl bg-gray-100 object-cover"
                            />
                        </div>
                    </div>


                    <div className="mx-auto mt-8 max-w-2xl sm:mt-16 sm:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-16 gap-y-8 sm:max-w-none sm:grid-cols-3">
                            {featuresCool.map((feature) => (
                                <div key={feature.description} className="relative pl-9">
                                    <dt className="inline text-base font-semibold leading-7 text-gray-900">
                                        <feature.icon className="absolute left-1 top-1 h-5 w-5 text-[#007436]" aria-hidden="true" />
                                        {feature.name}
                                    </dt>{' '}
                                    <dd className="inline text-base leading-7 text-gray-600">
                                        {feature.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                </div>
            </div>




            <div className="bg-white mt-32 sm:mt-56">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            {/* Use cases */}
                            Embrace verifiable draws across multiple use cases
                        </p>
                        {/* <p className="mt-6 text-lg leading-8 text-gray-600">
          Build provably secure applications with <span className="italic">Verifiable Draws</span> across multiple use cases.
          </p> */}
                    </div>
                    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-10 gap-y-20 lg:max-w-full lg:grid-cols-4">
                        {useCases.map((useCase) => (
                            <article key={useCase.id} className="flex flex-col items-start">
                                <div className="relative w-full">
                                    <Image
                                        src={useCase.imageUrl}
                                        alt=""
                                        className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                </div>
                                <div className="max-w-xl">
                                    <div className="group relative">
                                        <h3 className="mt-6 text-lg font-semibold leading-6 text-gray-900"> {/* group-hover:text-gray-600 */}
                                            {/* <Link href={post.href}> */}
                                            {/* <span className="absolute inset-0" /> */}
                                            {useCase.title}
                                            {/* </Link> */}
                                        </h3>
                                        <p className="mt-6 text-sm leading-6 text-gray-600">{useCase.description}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </div>




            {/* Concours Lépine */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
                <div className="relative mx-auto max-w-2xl text-center">
                    <p className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        An award-winning product 🏆
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        <span className="italic">Verifiable Draws</span> won a gold medal at Concours Lépine in 2023 which is the most famous innovation competition in France.
                    </p>

                    <Image
                        className="gold-medal m-auto -z-10 absolute hidden lg:block"
                        sizes="210px"
                        src={goldMedalImg}
                        alt="Médaille d'or du Concours Lépine 2023"
                    />
                </div>
                <ul
                    role="list"
                    className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
                >
                    {videos.map((video) => (
                        <li key={video.description}>
                            <Link href={video.videoUrl} target="_blank" className="">
                                <div className="relative w-full">
                                    <Image
                                        className="aspect-[3/2] w-full rounded-2xl object-cover"
                                        src={video.imageUrl}
                                        alt=""
                                        width="300"
                                        height="300"
                                    />

                                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                </div>

                                {/* <h3 className="mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900">{video.description}</h3> */}
                                <p className="text-base mt-6 leading-7 text-gray-600 underline">{video.description}</p>
                                <ul role="list" className="mt-6 flex gap-x-6">
                                    {
                                        (video.videoUrl.includes("youtube")) && (
                                            <li className="text-gray-400">
                                                {/* <Link href={video.videoUrl} target="_blank"> */}
                                                <span className="sr-only">Youtube</span>
                                                <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {/* </Link> */}
                                            </li>
                                        )
                                    }

                                    {
                                        (video.videoUrl.includes("linkedin")) && (
                                            <li className="text-gray-400">
                                                {/* <Link href={video.videoUrl} target="_blank" className="text-gray-400 hover:text-gray-500"> */}
                                                <span className="sr-only">LinkedIn</span>
                                                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                {/* </Link> */}
                                            </li>
                                        )
                                    }
                                </ul>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>


            {/* Powered By  */}
            <section className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
                <div style={{ boxSizing: 'border-box', margin: '0px auto', maxWidth: '1200px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                    <h2 data-main-heading="true" className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center">
                        Built on a foundation of decentralized,
                        <br />
                        battle-tested technologies
                    </h2>
                    <div data-version="v1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 1 auto', gap: '0px', position: 'relative', height: '264px', overflow: 'hidden', width: 'calc(100% + 16px * 2)', left: '-16px', outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                        <svg fill="none" height="264" role="img" viewBox="0 0 891 264" width="891" data-lines="true" aria-label="A bunch of connecting lines that form into the CPU, with the text Powered By on top of the the CPU. Gradient lines are animating along the drawn lines, dissolving into the CPU in the center." style={{ boxSizing: 'border-box', transform: 'matrix(1, 0, 0, 1, -2.5, 0)', position: 'absolute', top: '0px', outlineColor: 'rgb(37, 99, 235)', display: 'block', verticalAlign: 'middle', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                            <path d="M388 96L388 68C388 65.7909 386.209 64 384 64L310 64" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M349 150L73 150C70.7909 150 69 151.791 69 154L69 174" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <g style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <path d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                                <path d="M547 130L822 130C824.209 130 826 131.791 826 134L826 264" stroke="url(#orange-pulse-1)" strokeWidth="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            </g>
                            <g>
                                <path d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px"></path>
                                <path d="M349 130L5.00002 130C2.79088 130 1.00001 131.791 1.00001 134L1.00001 264" stroke="url(#blue-pulse-1)" strokeLinecap="round" strokeWidth="2"></path>
                            </g>
                            <g style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <path d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                                <path d="M547 150L633 150C635.209 150 637 151.791 637 154L637 236C637 238.209 635.209 240 633 240L488 240C485.791 240 484 241.791 484 244L484 264" stroke="url(#pink-pulse-2)" strokeLinecap="round" strokeWidth="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            </g>
                            <g style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <path d="M388 184L388 194C388 196.209 386.209 198 384 198L77 198C74.7909 198 73 199.791 73 202L73 264" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                                <path d="M388 184L388 194C388 196.209 386.209 198 384 198L77 198C74.7909 198 73 199.791 73 202L73 264" stroke="url(#blue-pulse-2)" strokeLinecap="round" strokeWidth="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            </g>
                            <path d="M412 96L412 0" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <g style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <path d="M412 263.5L412 184" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ transform: 'scale(-1)', transformOrigin: '412px 223.75px', boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                                <path d="M412 263.5L412 184" stroke="url(#pink-pulse-1)" strokeLinecap="round" strokeWidth="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            </g>
                            <g style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <path d="M508 96L508 88C508 85.7909 509.791 84 512 84L886 84C888.209 84 890 85.7909 890 88L890 264" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                                <path d="M508 96L508 88C508 85.7909 509.791 84 512 84L886 84C888.209 84 890 85.7909 890 88L890 264" stroke="url(#orange-pulse-2)" strokeWidth="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            </g>
                            <path d="M436 96L436 0" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M436 214L436 184" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ transform: 'scale(-1)', transformOrigin: '436px 199px', boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M460 96L460 64" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M460 239L460 184" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ transform: 'scale(-1)', transformOrigin: '460px 211.5px', boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M484 96L484 24C484 21.7909 485.791 20 488 20L554 20" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M484 184L484 210C484 212.209 485.791 214 488 214L560 214" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M508 184L508 193C508 195.209 509.791 197 512 197L560 197" stroke="var(--geist-foreground)" strokeOpacity="0.1" pathLength="1" strokeDashoffset="0px" strokeDasharray="1px 1px" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <circle cx="460" cy="64" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="460" cy="64" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="308" cy="64" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="308" cy="64" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="69" cy="173" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="69" cy="173" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="436" cy="214" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="436" cy="214" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="460" cy="240" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="460" cy="240" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="560" cy="214" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="560" cy="214" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="560" cy="197" fill="var(--geist-background)" r="4" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <circle cx="560" cy="197" r="3.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" opacity="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></circle>
                            <defs style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_341_27683" x1="412.5" x2="412.5" y1="-3.27835e-08" y2="96">
                                    <stop stopOpacity="0"></stop>
                                    <stop offset="1"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_341_27683" x1="436.5" x2="436.5" y1="-3.27835e-08" y2="96">
                                    <stop stopOpacity="0"></stop>
                                    <stop offset="1"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_341_27683" x1="554" x2="484" y1="20" y2="96">
                                    <stop stopOpacity="0"></stop>
                                    <stop offset="1"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="blue-pulse-1" x1="400" y1="83" x2="350" y2="133.75">
                                    <stop stopColor="#2EB9DF" stopOpacity="0"></stop><stop offset="0.05" stopColor="#2EB9DF"></stop>
                                    <stop offset="1" stopColor="#2EB9DF" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="blue-pulse-2" x1="400" y1="83" x2="350" y2="133.75">
                                    <stop stopColor="#2EB9DF" stopOpacity="0"></stop>
                                    <stop offset="0.05" stopColor="#2EB9DF"></stop>
                                    <stop offset="1" stopColor="#2EB9DF" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="pink-pulse-1" x1="400" y1="83" x2="350" y2="133.75">
                                    <stop stopColor="#FF4A81" stopOpacity="0"></stop>
                                    <stop offset="0.030" stopColor="#FF4A81"></stop>
                                    <stop offset="0.27" stopColor="#DF6CF6"></stop>
                                    <stop offset="1" stopColor="#0196FF" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="pink-pulse-2" x1="475" y1="120" x2="488" y2="150">
                                    <stop stopColor="#FF4A81" stopOpacity="0"></stop>
                                    <stop offset="0.0564843" stopColor="#FF4A81"></stop>
                                    <stop offset="0.4616" stopColor="#DF6CF6"></stop>
                                    <stop offset="1" stopColor="#0196FF" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="orange-pulse-1" x1="360" y1="130" x2="400" y2="170">
                                    <stop stopColor="#FF7432" stopOpacity="0"></stop>
                                    <stop offset="0.0550784" stopColor="#FF7432"></stop>
                                    <stop offset="0.373284" stopColor="#F7CC4B"></stop>
                                    <stop offset="1" stopColor="#F7CC4B" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" id="orange-pulse-2" x1="300" y1="140" x2="400" y2="180">
                                    <stop stopColor="#FF7432" stopOpacity="0"></stop>
                                    <stop offset="0.0531089" stopColor="#FF7432"></stop>
                                    <stop offset="0.415114" stopColor="#F7CC4B"></stop>
                                    <stop offset="1" stopColor="#F7CC4B" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <svg fill="none" height="312" viewBox="0 0 400 312" width="400" data-mobile-lines="true" style={{ boxSizing: 'border-box', top: '30px', display: 'none', position: 'absolute', outlineColor: 'rgb(37, 99, 235)', verticalAlign: 'middle', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                            <path d="M140 36L140 23C140 20.7909 138.209 19 136 19L62.0001 19" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M116 62L16.0001 62" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M284 62.0076L559 62.0076C561.209 62.0076 563 63.7985 563 66.0076L563 195.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M116 81.9318L-160 81.9318C-162.209 81.9318 -164 83.7226 -164 85.9317L-164 105.841" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M284.5 82L370 82C372.209 82 374 83.7909 374 86L374 301.883C374 304.092 372.209 305.883 370 305.883L240 305.883C237.791 305.883 236 307.674 236 309.883L236 312" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M140 108L140 117.825C140 120.034 138.209 121.825 136 121.825L67.0001 121.825" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M164 36L164 4" stroke="url(#paint0_linear_114_9407)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M164 172.5L164 108" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M188 36L188 4" stroke="url(#paint1_linear_114_9407)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M188 137.689L188 107.803" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M212 36.1364L212 4.25757" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M212 138L212 108" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M236 36L236 8C236 5.79086 237.791 4 240 4L306 4" stroke="url(#paint2_linear_114_9407)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M236 107.803L236 133.689C236 135.898 237.791 137.689 240 137.689L312 137.689" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M260 36.1364L260 28.1819C260 25.9727 261.791 24.1819 264 24.1819L638 24.1819C640.209 24.1819 642 25.9727 642 28.1819L642 203.5" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <path d="M260 107.803L260 116.754C260 118.963 261.791 120.754 264 120.754L312 120.754" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="212" cy="4.25755" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M215.5 4.25755C215.5 6.18039 213.935 7.7424 212 7.7424C210.065 7.7424 208.5 6.18039 208.5 4.25755C208.5 2.33471 210.065 0.772705 212 0.772705C213.935 0.772705 215.5 2.33471 215.5 4.25755Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="60.0001" cy="18.9848" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M63.5001 18.9848C63.5001 20.9077 61.9349 22.4697 60.0001 22.4697C58.0653 22.4697 56.5001 20.9077 56.5001 18.9848C56.5001 17.062 58.0653 15.5 60.0001 15.5C61.9349 15.5 63.5001 17.062 63.5001 18.9848Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="20.0001" cy="61.9848" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M23.5001 61.9848C23.5001 63.9077 21.9349 65.4697 20.0001 65.4697C18.0653 65.4697 16.5001 63.9077 16.5001 61.9848C16.5001 60.062 18.0653 58.5 20.0001 58.5C21.9349 58.5 23.5001 60.062 23.5001 61.9848Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="188" cy="137.985" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M191.5 137.985C191.5 139.908 189.935 141.47 188 141.47C186.065 141.47 184.5 139.908 184.5 137.985C184.5 136.062 186.065 134.5 188 134.5C189.935 134.5 191.5 136.062 191.5 137.985Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="66.0001" cy="121.985" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M69.5001 121.985C69.5001 123.908 67.9349 125.47 66.0001 125.47C64.0653 125.47 62.5001 123.908 62.5001 121.985C62.5001 120.062 64.0653 118.5 66.0001 118.5C67.9349 118.5 69.5001 120.062 69.5001 121.985Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="212" cy="137.985" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M215.5 137.985C215.5 139.908 213.935 141.47 212 141.47C210.065 141.47 208.5 139.908 208.5 137.985C208.5 136.062 210.065 134.5 212 134.5C213.935 134.5 215.5 136.062 215.5 137.985Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="312" cy="137.689" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M315.5 137.689C315.5 139.612 313.935 141.174 312 141.174C310.065 141.174 308.5 139.612 308.5 137.689C308.5 135.767 310.065 134.205 312 134.205C313.935 134.205 315.5 135.767 315.5 137.689Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <ellipse cx="312" cy="120.754" fill="var(--geist-background)" rx="4" ry="3.98485" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></ellipse>
                            <path d="M315.5 120.754C315.5 122.677 313.935 124.239 312 124.239C310.065 124.239 308.5 122.677 308.5 120.754C308.5 118.831 310.065 117.269 312 117.269C313.935 117.269 315.5 118.831 315.5 120.754Z" stroke="var(--geist-foreground)" strokeOpacity="0.1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></path>
                            <rect fill="url(#paint3_linear_114_9407)" height="60" rx="0.996212" transform="rotate(90 368 61)" width="1.99242" x="368" y="61" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></rect>
                            <rect fill="url(#paint4_linear_114_9407)" height="60" rx="0.996212" transform="matrix(0 1 1 0 38 81)" width="1.99242" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></rect>
                            <rect fill="url(#paint5_linear_114_9407)" height="28" rx="1" transform="matrix(1 0 0 -1 163 148)" width="2" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></rect>
                            <defs style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="164.5" x2="164.5" y1="4" y2="36" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="188.5" x2="188.5" y1="4" y2="36" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="306" x2="286.061" y1="4" y2="55.4142" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="369.799" x2="369.797" y1="121.239" y2="58.4805" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopColor="#FF4A81" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="0.21875" stopColor="#DF6CF7" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" stopColor="#0196FF" stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="1.79948" x2="1.79741" y1="60.2391" y2="-2.51953" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopColor="#FF7432" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="0.21875" stopColor="#F7CC4B" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" stopColor="#F7CC4B" stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                                <linearGradient gradientUnits="userSpaceOnUse" x1="1.80632" x2="1.80587" y1="28.1116" y2="-1.17578" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    <stop stopColor="#2EB9DF" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="0.21875" stopColor="#61DAFB" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                    <stop offset="1" stopColor="#61DAFB" stopOpacity="0" style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="foundation_cpu" data-version="v1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '0 1 auto', gap: '0px', userSelect: 'none', width: 'fit-content', padding: '21px 25px', borderRadius: '8px', fontSize: '24px', lineHeight: '26.4px', letterSpacing: '-0.96px', fontWeight: 700, color: 'rgb(255, 255, 255)', position: 'relative', background: 'linear-gradient(rgb(68, 68, 68) 0px, rgb(51, 51, 51) 100%) repeat scroll 0% 0% / auto padding-box border-box, rgba(0, 0, 0, 0) linear-gradient(rgba(255, 255, 255, 0.1) 0px, rgba(255, 255, 255, 0.1) 26.56%, rgba(0, 0, 0, 0.1) 51.56%, rgba(0, 0, 0, 0.1) 100%) repeat scroll 0% 0% / auto padding-box border-box', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.15) 0px 6px 4px -2px, rgba(0, 0, 0, 0.25) 0px -3px 1px -1px inset', transform: 'matrix(1, 0, 0, 1, 0, 8)', outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }} aria-hidden="true">
                            <div data-cpu-shine="true" style={{ boxSizing: 'border-box', overflow: 'hidden', width: '100%', height: '68.3984px', position: 'absolute', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></div>
                            <div data-connectors="true" data-side="left" style={{ boxSizing: 'border-box', flexDirection: 'column', left: '-10px', gap: '14px', position: 'absolute', display: 'flex', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 1px 0px 1px 1px inset, rgb(221, 221, 221) 1px 0px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', height: '6px', width: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 1px 0px 1px 1px inset, rgb(221, 221, 221) 1px 0px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', height: '6px', width: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span></div>
                            <div data-connectors="true" data-side="top" style={{ boxSizing: 'border-box', top: '-10px', gap: '18px', position: 'absolute', display: 'flex', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span></div><span data-text="true" style={{ boxSizing: 'border-box', background: 'rgba(0, 0, 0, 0) linear-gradient(92.66deg, rgb(174, 174, 174), rgb(234, 234, 234) 19.79%, rgb(157, 155, 155) 33.33%, rgb(239, 236, 236) 70.31%, rgb(132, 132, 132)) repeat scroll 0% 0% / auto padding-box', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'rgba(0, 0, 0, 0)', textShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 10px, rgba(0, 0, 0, 0.1) 0px -1px 0px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>Powered By</span>
                            <div data-connectors="true" data-side="bottom" style={{ boxSizing: 'border-box', bottom: '-10px', gap: '18px', position: 'absolute', display: 'flex', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) 0px -1px 1px 1px inset, rgb(221, 221, 221) 0px -1px 1px 0px inset', width: '6px', height: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span></div>
                            <div data-connectors="true" data-side="right" style={{ boxSizing: 'border-box', flexDirection: 'column', right: '-10px', gap: '14px', position: 'absolute', display: 'flex', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) -1px 0px 1px 1px inset, rgb(221, 221, 221) -1px 0px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', height: '6px', width: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span><span data-connector="true" style={{ boxSizing: 'border-box', borderRadius: '1px 1px 0px 0px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 2px 2px 1px, rgba(0, 0, 0, 0.1) -1px 0px 1px 1px inset, rgb(221, 221, 221) -1px 0px 1px 0px inset', background: 'rgba(0, 0, 0, 0) linear-gradient(90deg, rgb(255, 255, 255), rgb(217, 217, 217) 33.33%, rgb(255, 255, 255) 66.67%, rgb(188, 188, 188)) repeat scroll 0% 0% / auto padding-box border-box', height: '6px', width: '10px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}></span></div>
                        </div>
                    </div>
                    <div data-version="v1" className="flex flex-row flex-wrap sm:flex-nowrap gap-8 items-center justify-center">
                        <Link data-version="v1" className="foundation_card" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', color: 'rgb(0, 116, 222)', textDecoration: 'none solid rgb(0, 116, 222)', transition: 'background 0.15s ease 0s', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '0px', width: '100%', minHeight: '240px', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 0px 1px, rgba(0, 0, 0, 0.02) 0px 4px 6px 0px, rgb(250, 250, 250) 0px 0px 0px 6px inset', background: '#fff', position: 'relative', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)', touchAction: 'pan-y' }} data-variant="react" href="https://ipfs.tech/" rel="noopener" target="_blank">
                            <div data-icon="true" style={{ boxSizing: 'border-box', height: '40px', display: 'flex', alignItems: 'center', marginBottom: 'auto', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <Image
                                    className="h-14 w-auto"
                                    src={ipfsLogoImg}
                                    alt="IPFS"
                                />
                            </div>
                            <div data-version="v1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <span data-version="v1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', fontSize: '20px', lineHeight: '30px', letterSpacing: '-0.8px', color: 'rgb(0, 0, 0)', margin: '0px', fontWeight: 600, outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }} data-title="true">
                                    <span style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>IPFS</span>
                                    <svg viewBox="0 0 20 20" fill="rgb(150, 150, 150)" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span data-subtitle="true" style={{ boxSizing: 'border-box', fontSize: '14px', lineHeight: '21px', letterSpacing: '-0.14px', color: 'rgb(102, 102, 102)', margin: '0px', maxWidth: '440.918px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    The InterPlanetary File System (IPFS) is a distributed file storage protocol that allows computers all over the globe to store and serve files as part of a giant peer-to-peer network.
                                </span>
                            </div>
                        </Link>
                        <Link data-version="v1" className="foundation_card" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', color: 'rgb(0, 116, 222)', textDecoration: 'none solid rgb(0, 116, 222)', transition: 'background 0.15s ease 0s', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '0px', width: '100%', minHeight: '240px', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 0px 1px, rgba(0, 0, 0, 0.02) 0px 4px 6px 0px, rgb(250, 250, 250) 0px 0px 0px 6px inset', background: '#fff', position: 'relative', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)', touchAction: 'pan-y' }} data-variant="turbo" href="https://ethereum.org/" rel="noopener" target="_blank">
                            <div data-icon="true" style={{ boxSizing: 'border-box', height: '40px', display: 'flex', alignItems: 'center', marginBottom: 'auto', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <Image
                                    className="h-14 w-auto"
                                    src={ethereumLogoImg}
                                    alt=""
                                />
                            </div>
                            <div data-version="v1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <span data-version="v1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', fontSize: '20px', lineHeight: '30px', letterSpacing: '-0.8px', color: 'rgb(0, 0, 0)', margin: '0px', fontWeight: 600, outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }} data-title="true">
                                    <span style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>Ethereum</span>
                                    <svg viewBox="0 0 20 20" fill="rgb(150, 150, 150)" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span data-subtitle="true" style={{ boxSizing: 'border-box', fontSize: '14px', lineHeight: '21px', letterSpacing: '-0.14px', color: 'rgb(102, 102, 102)', margin: '0px', maxWidth: '440.918px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    Ethereum smart contracts are computer programs stored on the blockchain that are guaranteed to execute according to the rules defined by its code, which cannot be changed once created.
                                </span>
                            </div>
                        </Link>
                        <Link href="https://chain.link/vrf" rel="noopener" target="_blank" data-version="v1" className="foundation_card" style={{ WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)', color: 'rgb(0, 116, 222)', textDecoration: 'none solid rgb(0, 116, 222)', transition: 'background 0.15s ease 0s', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '0px', width: '100%', minHeight: '240px', borderRadius: '12px', padding: '24px', boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 0px 1px, rgba(0, 0, 0, 0.02) 0px 4px 6px 0px, rgb(250, 250, 250) 0px 0px 0px 6px inset', background: '#fff', position: 'relative', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)', touchAction: 'pan-y' }} data-variant="swc">
                            <div data-icon="true" style={{ boxSizing: 'border-box', height: '40px', display: 'flex', alignItems: 'center', marginBottom: 'auto', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <Image
                                    className="h-14 w-auto"
                                    src={chainlinkLogoImg}
                                    alt=""
                                />
                            </div>
                            <div data-version="v1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                <span data-version="v1" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', flex: '0 1 auto', gap: '4px', fontSize: '20px', lineHeight: '30px', letterSpacing: '-0.8px', color: 'rgb(0, 0, 0)', margin: '0px', fontWeight: 600, outlineColor: 'rgb(37, 99, 235)', boxSizing: 'border-box', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }} data-title="true">
                                    <span style={{ boxSizing: 'border-box', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>Chainlink VRF</span>
                                    <svg viewBox="0 0 20 20" fill="rgb(150, 150, 150)" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <span data-subtitle="true" style={{ boxSizing: 'border-box', fontSize: '14px', lineHeight: '21px', letterSpacing: '-0.14px', color: 'rgb(102, 102, 102)', margin: '0px', maxWidth: '440.918px', outlineColor: 'rgb(37, 99, 235)', borderWidth: '0px', borderStyle: 'solid', borderColor: 'rgb(234, 234, 234)' }}>
                                    {/* Chainlink enhances smart contract capabilities by allowing access to data outside the blockchain and off-chain computing while keeping blockchain technology&apos;s security and reliability assurances. */}
                                    Chainlink VRF provides cryptographically secure randomness that cannot be manipulated by any user, node operator, or malicious actor.
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>



            {/* Pricing section */}
            <div className="py-24 sm:pt-48">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2> */}
                        <p className="mt-2 mb-16 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                            Simple pricing
                        </p>
                    </div>
                    {/* <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
                The more you buy, the cheaper it gets
            </p> */}


<div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular ? 'lg:z-10 ring-2 ring-indigo-600' : 'lg:my-8 ring-1 ring-gray-200',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 xl:p-10'
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className={classNames(
                      tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                      'text-lg font-semibold leading-8'
                    )}
                  >
                    {tier.name}
                  </h3>
                  {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                      Most popular
                    </p>
                  ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                    {tier.id !== 'tier-enterprise' ? (
                        <span className="text-sm font-semibold leading-6 text-gray-600">/draw</span>
                    ) : null}
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                  {tier.features.map((feature) => (
                    <li key={feature.text} className="flex gap-x-3">
                        {feature.included ? (
                            <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        ) : (
                            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clip-rule="evenodd"></path>
                            </svg>
                        )}

                        {feature.text}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 pointer-events-none mb-8'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                  'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
              >
                 {tier.cta}
              </a>
            </div>
          ))}
        </div>


{/* <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold leading-7'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                {tier.price}
              </span>


                {tier.id !== 'tier-enterprise' ? (
                                        <span
                                            className={classNames(
                                                tier.featured ? 'text-gray-300' : 'text-gray-600',
                                                'text-sm font-semibold leading-6'
                                            )}
                                        >
                                            /draw
                                        </span>
                                    ) : null}


            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature.text} className="flex gap-x-3">
                  <CheckIcon
                    className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                    aria-hidden="true"
                  />
                  {feature.text}
                </li>
              ))}
            </ul>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
              )}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div> */}


                </div>
            </div>





            {/* CTA section */}
            <div id="join-community" className="relative -z-10 mx-auto py-32 max-w-7xl px-6 sm:py-40 lg:px-8">
                <div
                    className="absolute inset-x-0 -top-72 -z-10 flex -translate-y-1/2 transform-gpu justify-center overflow-hidden blur-3xl sm:right-[calc(50%-6rem)] sm:translate-y-0 sm:transform-gpu sm:justify-end"
                    aria-hidden="true"
                >
                    <div
                        className="aspect-[1108/632] w-[69.25rem] flex-none bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-25"
                        style={{
                            clipPath:
                                'polygon(73.6% 48.6%, 91.7% 88.5%, 100% 53.9%, 97.4% 18.1%, 92.5% 15.4%, 75.7% 36.3%, 55.3% 52.8%, 46.5% 50.9%, 45% 37.4%, 50.3% 13.1%, 21.3% 36.2%, 0.1% 0.1%, 5.4% 49.1%, 21.4% 36.4%, 58.9% 100%, 73.6% 48.6%)',
                        }}
                    />
                </div>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Looking for more ?
                        <br />
                        Join our community.
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
                        We invite you to join our Discord community where you will be able to talk to our team, follow the project latest news, and see what other people are using <span className="italic">Verifiable Draws</span> for.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="https://discord.gg/3YjqW9MP7H"
                            rel="noopener"
                            target="_blank"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Open Discord
                        </Link>
                    </div>
                </div>
                <div
                    className="absolute left-1/2 right-0 top-1/2 -z-10 hidden -translate-y-1/2 transform-gpu overflow-hidden blur-3xl sm:block"
                    aria-hidden="true"
                >
                    <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }} />
                </div>
            </div>


        </div>


    )
}
