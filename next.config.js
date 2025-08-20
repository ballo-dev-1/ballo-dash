/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // reactRoot: true, // Enables React 18's new root API (removed, not supported)
  },
  webpack(config, { isServer }) {
    if (isServer) {
      // Exclude client-specific libraries (like ones using 'document' or 'window')
      config.externals = ["react-syntax-highlighter", ...config.externals];
    }
    return config;
  },
  images: {
    domains: ["lh3.google.com"], // ✅ Whitelist image domains
  },
};

module.exports = nextConfig;
