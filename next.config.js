/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  output: "export",
  trailingSlash: true,
    images: {
      unoptimized: true,
    },
};

module.exports = nextConfig;
