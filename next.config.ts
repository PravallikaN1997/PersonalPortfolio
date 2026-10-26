import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // The gated screenshots are read from disk by the media route; make sure they ship with it.
  outputFileTracingIncludes: {
    "/work/ownership-and-progress": ["./app/work/ownership-and-progress/_media/**"],
    "/work/ownership-and-progress/media/[name]": ["./app/work/ownership-and-progress/_media/**"],
  },
  partialPrefetching: true,
  async headers() {
    return [
      {
        // Belt and braces with the page's robots metadata.
        source: "/work/ownership-and-progress/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
