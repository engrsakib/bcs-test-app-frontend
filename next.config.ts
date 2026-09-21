import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const internalApiBase =
  process.env.INTERNAL_API_BASE_URL?.replace(/\/+$/, "") ||
  "http://127.0.0.1:9001/api/v1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${internalApiBase}/:path*`,
      },
    ];
  },
};

export default withSerwist(nextConfig);
