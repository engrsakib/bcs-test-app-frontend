import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // ডকারের জন্য মাস্ট

  async rewrites() {
    return [
      {
        // ফ্রন্টএন্ডে যখনই আপনি /api/v1/... কল করবেন
        source: "/api/v1/:path*", 
        // তখন এটি এই ব্যাকেন্ড ইউআরএল-এ রিকোয়েস্ট পাঠিয়ে দিবে
        destination: "https://mcq-analysis-apps-server.onrender.com/api/v1/:path*", 
      },
    ];
  },
};

export default nextConfig;