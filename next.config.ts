/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Tailwind 4 için optimizasyon
  experimental: {
    optimizeCss: false, // Lab color hatası için
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;