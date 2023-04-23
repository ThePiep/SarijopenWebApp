/** @type {import('next').NextConfig} */

// const withPWA = require("next-pwa")({
//   dest: "app",
// });

const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["mysql2"],
  },
};

module.exports = nextConfig;
