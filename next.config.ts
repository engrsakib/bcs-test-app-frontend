import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // ডকার বিল্ডের সাইজ কমানোর জন্য এবং প্রোডাকশনে রান করার জন্য এটি অপরিহার্য
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*", // ফ্রন্টএন্ড থেকে আসা /api কলগুলো
        destination: "https://mcq-analysis.vercel.app/api/:path*", // এই ব্যাকএন্ডে রিডাইরেক্ট হবে
      },
    ];
  },
};

export default nextConfig;