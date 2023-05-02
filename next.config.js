/** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa")({
//   dest: "app",
// });

const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mysql2'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
