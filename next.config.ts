import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Next.js 16 validates `quality` against this allow-list. 75 is the
    // default used everywhere via next/image's own default; 100 is added
    // for ProjectMedia.tsx, which deliberately skips compression for
    // project screenshots.
    qualities: [75, 100],
  },
  experimental: {
    // Route navigations trigger React's <ViewTransition> (see app/template.tsx).
    viewTransition: true,
    // Server Actions default to a 1MB request body, far too small for the
    // contact form's file attachment (photos, video, audio, PDFs, docs).
    // Kept above lib/constants/contact.ts's MAX_ATTACHMENT_BYTES so form
    // fields + multipart overhead never get clipped right at the boundary,
    // and at Vercel's 4.5MB function body cap — anything larger is rejected
    // by the platform before it reaches Next.js anyway.
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig