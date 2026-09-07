import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles its own output format; standalone is only needed for
  // self-hosted / Docker deployments. Setting it on Vercel causes a build
  // failure (missing next-server.js.nft.json).
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
};

export default nextConfig;
