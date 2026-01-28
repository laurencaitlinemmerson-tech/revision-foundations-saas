import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Turbopack uses this workspace as the root to avoid
  // incorrect root inference when multiple lockfiles exist.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
