import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'catbox.moe',
        port: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
