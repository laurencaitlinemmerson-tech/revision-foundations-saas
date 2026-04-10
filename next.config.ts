import type { NextConfig } from "next";
import { execSync } from "child_process";
import path from "path";

// When running in a git worktree, node_modules live in the main repo.
// Resolve the git common dir so Turbopack's root includes node_modules.
let turbopackRoot = __dirname;
try {
  const gitCommonDir = execSync("git rev-parse --git-common-dir", { cwd: __dirname })
    .toString()
    .trim();
  const resolved = path.resolve(__dirname, gitCommonDir, "..");
  if (resolved !== __dirname) turbopackRoot = resolved;
} catch {
  // not a git repo or git not available — keep __dirname
}

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],

  // Ensure Turbopack uses the repo root (handles git worktrees where
  // node_modules live in the main checkout, not the worktree).
  turbopack: {
    root: turbopackRoot,
  },

  // Performance optimizations
  compress: true,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/:path*.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO (add trailing slash handling)
  async redirects() {
    return [
      // Remove trailing slashes for consistency
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
