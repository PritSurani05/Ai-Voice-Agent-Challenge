import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure the dev server binds to localhost for secure context
  // This is required for getUserMedia to work
  
  // Optimize Fast Refresh to prevent unnecessary full reloads
  reactStrictMode: true,
  
  // Configure headers to allow eval for required libraries (LiveKit, etc.)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: ws:",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-src 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
