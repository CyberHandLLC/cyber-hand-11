/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // This ensures that we can properly work with the Shadcn-UI components
  transpilePackages: [],
};

module.exports = nextConfig;
