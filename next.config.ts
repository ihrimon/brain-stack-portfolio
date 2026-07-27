import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
    ],
  },
  experimental: {
    // Server Actions default to a 1MB request body, far too small for the
    // contact form's file attachment (photos, video, audio, PDFs, docs).
    // Kept above lib/actions/contact.ts's MAX_ATTACHMENT_BYTES so form
    // fields + multipart overhead never get clipped right at the boundary.
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
}

export default nextConfig