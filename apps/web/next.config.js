/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
