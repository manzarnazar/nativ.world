import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-estay.thewrteam.in",
      },
      {
        protocol: "https",
        hostname: "admin.nativ.world",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        destination: '/api/sw',
      },
    ];
  },
};

export default nextConfig;
