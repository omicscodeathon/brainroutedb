// brainroute-app/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/brainroutedb',
  assetPrefix: '/brainroutedb/',
  output: 'export',  // Required for static export to gh-pages
}

module.exports = nextConfig