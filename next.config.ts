import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "hsbjnzxhnwbkocuxtpfi.supabase.co" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  cacheComponents: true,
};

export default nextConfig;
