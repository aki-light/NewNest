/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath : process.env.GITHUB_PAGES ? '/NewNest' : '',
  assetPrefix : process.env.GITHUB_PAGES ? '/NewNest' : '',
  publicRuntimeConfig: {
    staticFolder: process.env.GITHUB_PAGES ? '/NewNest' : '',
    apiHost:  process.env.GITHUB_PAGES 
      ? 'https://www.new-nest.net/laravel_api' 
      : 'http://127.0.0.1:8000',
  },
}

module.exports = nextConfig
