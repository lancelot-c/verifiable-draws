import './../globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import lotteryLogo from '/public/img/acme-lottery-logo.png'
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ['latin'] })

import {
    Bars3Icon,
} from '@heroicons/react/24/solid'

export const metadata = {
    title: 'Transparent Lottery',
    description: 'The first online lottery which is 100% transparent ✨',
}

const navigation: any[] = [
    { name: 'Draw results', href: '#' },
    { name: 'News', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'About us', href: '#' },
  ]


export default function RootLayout({ children }: { children: React.ReactNode }) {



  return (
    <html lang="en">

      <body className={inter.className}>

      <div className="bg-white">



      <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex flex-1">
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div className="-m-1.5 p-1.5 flex items-center justify-between">
          {/* <span className="sr-only">Your Company</span> */}
          <Image className="h-8 w-auto" src={lotteryLogo} alt="" />
          <p className="ml-2 font-semibold tracking-tight text-gray-900 sm:text-md text-center">
                Transparent Lottery
            </p>
        </div>
        <div className="flex flex-1 justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
    </header>






        {/* Header */}
{/* <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <Link href="/" className="-m-1.5 p-1.5">
                        <div className="flex lg:flex-1 items-center">
                            <Image
                                className="h-8 w-auto"
                                src={lotteryLogo}
                                alt=""
                            />
                            <div className="text-lg ml-3 font-semibold leading-6 text-gray-900">
                                Lottery Corporation
                            </div>
                        </div>
                    </Link>
          <div className="flex hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
               onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href="#join-community" className="text-sm font-semibold leading-6 text-gray-900">
                            Log in <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header> */}

      <main className="isolate">

        {children}

      </main>
        
        
        
        
        {/* Footer */}
        <footer aria-labelledby="footer-heading" className="relative mx-auto mt-4 max-w-7xl px-6 lg:px-8">
                {/* <h2 id="footer-heading" className="sr-only">
                    Footer
                </h2> */}
                <div className="mx-auto max-w-7xl px-6 pb-8 pt-4 lg:px-8">
                    <div className="border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
                        {/* <div className="flex items-center space-x-6 md:order-2">
                            {footerNavigation.social.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    rel="noopener"
                                    target="_blank"
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">{item.name}</span>
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                </Link>
                            ))}
                        </div> */}
                        {/* <p className="mt-8 text-xs text-center w-full leading-5 text-gray-400 md:order-1 md:mt-0">
                            Transparent Lottery is a demo brought to you by <Link href="https://www.verifiabledraws.com/" className="underline hover:text-gray-500">Verifiable Draws</Link>.
                        </p> */}
                    </div>
                </div>
            </footer>

        </div>
        
        
        </body>
    </html>
  )
}
