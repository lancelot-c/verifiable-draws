/** @type {import('next').NextConfig} */

const nextConfig = {};

module.exports = {
    ...nextConfig,
    webpack: (config, { isServer }) => {
        if (isServer) {
            config.externals.push({ bufferutil: "bufferutil", "utf-8-validate": "utf-8-validate", });
        }
        return config;
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: 'https://www.verifiabledraws.com/',
                permanent: true,
            },
        ]
    },
    // ⬇ Only works in production, not in dev, that's a known Next.JS bug : https://github.com/vercel/next.js/issues/40549 
    rewrites: async () => {
        return {
            // These rewrites are checked after headers/redirects
            // and before all files including _next/public files which
            // allows overriding page files
            beforeFiles: [
                {
                    source: '/:cid',
                    destination: '/ipfs?cid=:cid',
                },
            ],
        };
    }
}