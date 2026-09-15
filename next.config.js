/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/philosophy",
        destination: "/company",
        permanent: true,
      },
      {
        source: "/partners",
        destination: "/company",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
