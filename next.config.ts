import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '192.168.1.68',
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
  ],
};

export default nextConfig;