import { useEffect, useState } from 'react'
import { init, useConnectWallet } from '@web3-onboard/react'
import type { TokenSymbol } from '@web3-onboard/common'
import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseModule from '@web3-onboard/coinbase'
import { ethers, Contract } from 'ethers'
import vdIcon from '../../../assets/vd-icon'
import arbIcon from '../../../assets/arb-icon'
import contractAbi from '../../../assets/abi'
import { CheckIcon, InformationCircleIcon } from '@heroicons/react/24/outline'


const envDrawUsdPrice = Number(process.env.NEXT_PUBLIC_DRAW_USD_PRICE);
const chainId = (process.env.NEXT_PUBLIC_APP_ENV == "prod") ? 42161 : 421614;
const contractAddress = (process.env.NEXT_PUBLIC_APP_ENV == "prod") ? process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS : process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;


const features = [
    { included: true, text: 'Deploy on Arbitrum One mainnet' },
    { included: true, text: 'Publish on the public IPFS network' },
    { included: true, text: 'Automatic trigger at the scheduled date' },
    { included: true, text: 'Onchain randomness generation' },
];


interface Account {
    address: string,
    balance: Record<TokenSymbol, string> | null,
    ens: { name: string | undefined, avatar: string | undefined }
}

const injected = injectedModule()
const walletConnect = walletConnectModule({ projectId: '442d149732b9dd3f51bf05c71ae62fd5', dappUrl: 'https://www.verifiabledraws.com/' })
const coinbase = coinbaseModule()
const ledger = ledgerModule({ walletConnectVersion: 2, projectId: '442d149732b9dd3f51bf05c71ae62fd5' })

const wallets = [
    injected,
    walletConnect,
    coinbase,
    ledger
]


const allChains = [
    {
        id: 421614,
        token: 'ETH',
        label: 'Arbitrum Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC,
        icon: arbIcon
    },
    {
        id: 42161,
        token: 'ETH',
        label: 'Arbitrum One',
        rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC,
        icon: arbIcon
    },
]

const chains = new Array(allChains.find(chain => chain.id === chainId) as {
    id: number;
    token: string;
    label: string;
    rpcUrl: string;
});

const appMetadata = {
    name: 'Verifiable Draws',
    icon: vdIcon,
    description: 'Verifiable Draws provides your offchain applications with onchain verifiable randomness, unlocking the maximum level of security and transparency for your users.',
    recommendedInjectedWallets: [
        { name: 'MetaMask', url: 'https://metamask.io' },
        { name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
    ]
}

const web3Onboard = init({
    apiKey: process.env.BLOCKNATIVE_API_KEY,
    connect: {
        autoConnectAllPreviousWallet: true
    },
    wallets,
    chains,
    appMetadata,
    accountCenter: {
        desktop: {
            enabled: true,
            position: 'topRight',
            minimal: false
        },
        mobile: {
            enabled: true,
            position: 'bottomLeft',
            minimal: true
        }
    }
})



export default function PaymentStep(
    { ethPrice, deploy }: { ethPrice: number, deploy: (mainnet: boolean, owner?: string) => void }
) {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
    const [ethersProvider, setProvider] = useState<ethers.BrowserProvider | null>()
    const [account, setAccount] = useState<Account | null>(null)
    const [ethAmount, setEthAmount] = useState<number>(0);
    const [usdAmount, setUsdAmount] = useState<number>(0);


    // function shorten(account: string) {

    //     if (account.length > 20) {
    //         return account.substring(0, 6) + '...' + account.substring(account.length-4, account.length);
    //     }

    //     return account;
    // }

    async function confirmDeploy() {

        const success = await web3Onboard.setChain({ chainId: chains[0].id })

        if (!success) {
            return;
        }

        const signer = await ethersProvider?.getSigner();

        if (signer && account && contractAddress) {

            const contractInstance = new Contract(contractAddress, contractAbi, signer);

            const options = { value: ethers.parseEther(ethAmount.toFixed(18).toString()) }

            console.log(`topUp address ${account.address} with ${options.value.toString()} wei\n`);

            const unsignedTx = await contractInstance.topUp(`${account.address}`, options);
            
            deploy(true, (account as Account).address);
        }



    }


    useEffect(() => {
        if (ethPrice == 0 || !envDrawUsdPrice) {
            return;
        }

        let ignore = false;

        const safetyNet = 0.02; // Pay 1% more to prevent the deployment from failing if the price of ETH fluctuates between the payment and the actual deployment
        const tempEthAmount = (envDrawUsdPrice * (1 + safetyNet)) / ethPrice;
        const tempUsdAmount = tempEthAmount * ethPrice;

        setEthAmount(tempEthAmount);
        setUsdAmount(tempUsdAmount);


        return () => {
            ignore = true;
        };

    }, [ethPrice])


    useEffect(() => {
        if (wallet?.provider) {
            const { name, avatar } = wallet?.accounts[0].ens ?? {}
            setAccount({
                address: wallet.accounts[0].address,
                balance: wallet.accounts[0].balance,
                ens: { name, avatar: avatar?.url }
            })
        }
    }, [wallet])


    useEffect(() => {
        // If the wallet has a provider than the wallet is connected
        if (wallet?.provider) {
            setProvider(new ethers.BrowserProvider(wallet.provider, 'any'))
        }
    }, [wallet])


    return (
        <div className="flex flex-wrap flex-col justify-center justify-items-center items-center mt-10 w-full">

            <ul role="list" className="p-8 space-y-3 text-sm leading-6 text-gray-600 border-b border-gray-200">
                {features.map((feature) => (
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

            <p className="text-center pt-4 text-gray-600 flex">
                {/* Tooltip */}
                {/* <div className="group flex relative">
                    <InformationCircleIcon data-tooltip-target="tooltip-default" className="h-6 w-5 text-gray-600" aria-hidden="true" />
                    <div className="group-hover:opacity-100 transition-opacity bg-gray-800 p-4 text-sm text-gray-100 rounded-md absolute left-1/2 
                    -translate-x-full -translate-y-1/2 opacity-0 m-4 mx-auto w-80">
                        This fee covers:
                        <ul className="list-disc ml-4">
                            <li>The deployment transaction</li>
                            <li>IPFS hosting</li>
                            <li>Onchain randomness generation</li>
                            <li>Trigger transaction at the scheduled date</li>
                        </ul>
                    </div>
                </div> */}
                <div className="ml-2">One-time fee: {ethAmount.toFixed(5)} ETH</div>
                <div className="ml-8">(${usdAmount.toFixed(2)})</div>
            </p>

            <div className="flex flex-col">
                {
                    (wallet?.provider && account) ? (
                        <div>
                            {/* {account.ens?.avatar ? (<img src={account.ens?.avatar} alt="ENS Avatar" />) : null} */}
                            {/* <div>{ account.ens?.name ? account.ens.name : account.address }</div>
                        <div>Connected to {wallet.label}</div> */}

                            <button
                                onClick={() => { confirmDeploy() }}
                                className="w-full rounded-md border border-transparent bg-indigo-600 px-16 py-3 mt-8 mb-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                            >
                                Confirm deploy
                            </button>


                            {/* <button
                            type="button"
                            onClick={() => { disconnect({ label: wallet.label }) }}
                            className="px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            Disconnect { shorten(account.ens?.name ? account.ens.name : account.address) }
                        </button> */}

                        </div>
                    ) : (
                        <button
                            onClick={() => { connect() }}
                            disabled={connecting}
                            className="w-full rounded-md border border-transparent bg-indigo-600 px-16 py-3 mt-8 mb-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        >
                            Connect wallet
                        </button>
                    )




                }

                <button
                    type="button"
                    onClick={() => { deploy(false) }}
                    className="px-3 py-2 text-sm font-semibold text-gray-700"
                >
                    Deploy on testnet for free instead <span aria-hidden="true">→</span>
                </button>
            </div>

        </div>
    )
}
