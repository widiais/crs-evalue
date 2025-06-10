/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated appDir option as it's default in Next.js 14
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig 