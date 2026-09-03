import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // ডকারের জন্য মাস্ট

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://187.52.120.181:9001/api/v1/:path*",
      },
    ];
  },
};

export default withSerwist(nextConfig);
