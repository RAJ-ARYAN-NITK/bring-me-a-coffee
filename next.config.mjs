/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'c10.patreonusercontent.com'
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com'
            },
        ], 
    },
};

export default nextConfig;
