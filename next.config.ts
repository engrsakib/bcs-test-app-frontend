// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;





import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend → /api/...
        destination: "https://mcq-analysis.vercel.app/api/:path*", // backend untouched
      },
    ];
  },
};

export default nextConfig;
