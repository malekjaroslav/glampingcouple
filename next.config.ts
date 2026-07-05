import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Two root layouts (cs at /, en at /en) need a routing-level 404 document.
    globalNotFound: true,
  },
};

export default nextConfig;
