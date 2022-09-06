const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["dl.airtable.com"],
  },
  async headers() {
    return [
      {
        // list more extensions here if needed; these are all the resources in the `public` folder including the subfolders
        source: "/:all*(svg|jpg|png|gltf|glb)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, stale-while-revalidate",
          },
        ],
      },
    ];
  },
});

module.exports = nextConfig;
