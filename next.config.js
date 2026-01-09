/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  images: {
    domains: [],
    unoptimized: true, // Disable image optimization to prevent memory issues
  },
  // Prevent large buffer allocations
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB limit
  },
};

module.exports = nextConfig;
