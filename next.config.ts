import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: [process.env.CONVEX_HOST_NAME!],
  },
};

export default nextConfig;
