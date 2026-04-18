// brainroute-app/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/brainroutedb' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/brainroutedb/' : '',
  output: 'export',  // Required for static export to gh-pages
}

module.exports = nextConfig