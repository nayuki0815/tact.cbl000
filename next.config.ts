import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/mypage',
        permanent: true,
      },
      {
        source: '/dashboard/:path*',
        destination: '/mypage/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
