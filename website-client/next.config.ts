import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  output: 'standalone',
  images: {
    domains: ['storage.googleapis.com'],
  },
};

export default nextConfig;
