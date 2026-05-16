import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // ডকারের জন্য মাস্ট

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*", 
        destination: "https://mcq-analysis-apps-server.onrender.com/api/v1/:path*", 
      },
    ];
  },
};

export default nextConfig;