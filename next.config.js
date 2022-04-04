/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV,
  }
}

