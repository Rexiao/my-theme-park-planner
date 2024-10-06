/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  productionBrowserSourceMaps: true
}

module.exports = nextConfig