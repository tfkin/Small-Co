import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [process.env.CONVEX_HOST_NAME!],
  },
};

export default nextConfig;
