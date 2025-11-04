import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dxx2sp3l3nwby.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cataas.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.olx.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "adotar.com.br",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
