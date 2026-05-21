import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // /api/tipchain/creator/trending → http://localhost:4000/api/creator/trending
        source: "/api/tipchain/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
