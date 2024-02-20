// GoogleTag.tsx
"use client"

// import { GTM_ID, pageview } from "./lib/gtm"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect } from "react"

// lib/gtm.ts
type WindowWithDataLayer = Window & {
    dataLayer: Record<string, any>[]
}

declare const window: WindowWithDataLayer

const GTM_ID = process.env.GOOGLE_TAG_MANAGER_ID

const pageview = (url: string) => {
    if (typeof window.dataLayer !== "undefined") {
        window.dataLayer.push({
            event: "pageview",
            page: url,
        })
    } else {
        console.log({
            event: "pageview",
            page: url,
        })
    }
}


export default function GoogleTag() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (pathname) {
            pageview(pathname)
        }
    }, [pathname, searchParams])

    if (process.env.NEXT_PUBLIC_APP_ENV !== "prod") {
        return null
    }

    return (
        <div>
            {/* <!-- Google tag (gtag.js) --> */}
            <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-11291367227"></Script>
            <Script id="google-analytics">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag() { window.dataLayer.push(arguments) }
                    gtag('js', new Date());

                    gtag('config', 'AW-11291367227');
                `}
            </Script>
        </div>
    )
}