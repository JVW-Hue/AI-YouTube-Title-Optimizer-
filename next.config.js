/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/AI-YouTube-Title-Optimizer-',
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig