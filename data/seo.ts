import type { Metadata } from "next"

export const seoMetadata: Metadata = {
  title: "Brain Stack - Premium Software Development & Consulting",
  description:
    "Transform your ideas into scalable software solutions. Brain Stack delivers enterprise-grade development with a focus on quality, innovation, and long-term success. 150+ successful projects worldwide.",
  keywords: [
    "software development",
    "consulting",
    "web development",
    "app development",
    "enterprise solutions",
    "custom software",
    "full-stack development",
    "tech consulting",
  ],
  creator: "Brain Stack",
  publisher: "Brain Stack",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brainstack.com",
    siteName: "Brain Stack",
    title: "Brain Stack - Premium Software Development & Consulting",
    description:
      "Transform your ideas into scalable software solutions. Enterprise-grade development with a focus on quality and innovation.",
    images: [
      {
        url: "https://brainstack.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brain Stack - Premium Software Development",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Stack - Premium Software Development",
    description: "Transform your ideas into scalable software solutions",
    creator: "@brainstack",
    images: ["https://brainstack.com/og-image.png"],
  },
  appLinks: [],
  alternates: {
    canonical: "https://brainstack.com",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

export const structuredDataScript = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Brain Stack",
  alternateName: "BrainStack",
  url: "https://brainstack.com",
  logo: "https://brainstack.com/logo.png",
  sameAs: [
    "https://twitter.com/brainstack",
    "https://linkedin.com/company/brainstack",
    "https://github.com/brainstack",
  ],
  description: "Premium software development consulting firm",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-555-123-4567",
    contactType: "Customer Service",
  },
}
