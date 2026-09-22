/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'apis.ukaautotrade.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'apis.ukaautotrade.co.uk',
      },
      {
        protocol: 'http',
        hostname: '*.ukaautotrade.co.uk',
      },
      {
        protocol: 'https',
        hostname: '*.ukaautotrade.co.uk',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
      },
    ],
  },
};

module.exports = nextConfig;
