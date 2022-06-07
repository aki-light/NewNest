/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath : process.env.GITHUB_PAGES ? '/NewNest' : '',
  assetPrefix : process.env.GITHUB_PAGES ? "/NewNest" : "",
  publicRuntimeConfig: {
    staticFolder: process.env.GITHUB_PAGES ? "/NewNest" : "",
  },
}

module.exports = nextConfig
