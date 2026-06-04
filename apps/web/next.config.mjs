// apps/web/next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@purhami/api-client",
    "@purhami/design-tokens",
    "@purhami/design-system",
    "@purhami/brand-ornament-engine",
    "@purhami/config",
    "@purhami/contracts"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.purhami.local', // Base media contract requirement
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Safe fallback host for internal staging without mock data injection
        pathname: '/**',
      }
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
