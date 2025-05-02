import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  devIndicators: {
    appIsrStatus: false,
  },
  output: "standalone",
  images: {
    domains: ["storage.googleapis.com"],
  },
};

export default nextConfig;
