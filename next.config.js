/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath : process.env.GITHUB_PAGES ? '/nextjs_sample' : '',
  assetPrefix : process.env.GITHUB_PAGES ? "/nextjs_sample/" : ""
}

module.exports = nextConfig
