/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["dl.airtable.com"],
  },
};

module.exports = nextConfig;
