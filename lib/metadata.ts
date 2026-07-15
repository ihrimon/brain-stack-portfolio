import type { Metadata } from "next";

export const siteConfig = {
  name: "Brain Stack",
  description:
    "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams — from MVP to scale.",
  url: "https://brainstack.dev",
  ogImage: "https://res.cloudinary.com/dieth2xb3/image/upload/v1755799085/ssimage_bxr8i6.png",
  logo: "/logo.jpeg",
  keywords: [
    "software development agency",
    "full stack development",
    "mobile app development",
    "AI integration and automation",
    "SaaS development",
    "UI UX design",
    "product engineering",
    "cloud and devops",
    "MVP development",
    "digital transformation",
  ],
  authors: [
    {
      name: "Brain Stack",
      url: "https://brainstack.dev",
    },
  ],
  creator: "Brain Stack",
  publisher: "Brain Stack",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brainstack.dev",
    siteName: "Brain Stack",
    title: "Brain Stack - We Build Digital Products People Love",
    description:
      "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams — from MVP to scale.",
    images: [
      {
        url: "https://res.cloudinary.com/dieth2xb3/image/upload/v1755799085/ssimage_bxr8i6.png",
        width: 1200,
        height: 630,
        alt: "Brain Stack - We Build Digital Products People Love",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brain Stack - We Build Digital Products People Love",
    description:
      "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams — from MVP to scale.",
    images: ["https://res.cloudinary.com/dieth2xb3/image/upload/v1755799085/ssimage_bxr8i6.png"],
    creator: "@brainstack",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://brainstack.dev",
  },
  category: "technology",
};

export const pageMetadata = {
  home: {
    title: "Brain Stack - We Build Digital Products People Love",
    description:
      "Full stack development, mobile apps, AI integration, and SaaS engineering for startups and enterprises. See how Brain Stack ships digital products that scale.",
    keywords: [
      "software development agency",
      "full stack development",
      "mobile app development",
      "AI integration",
      "SaaS development",
      "product engineering",
      "digital transformation",
    ],
    openGraph: {
      title: "Brain Stack - We Build Digital Products People Love",
      description:
        "Full stack development, mobile apps, AI integration, and SaaS engineering for startups and enterprises. See how Brain Stack ships digital products that scale.",
      url: "https://brainstack.dev",
      type: "website",
    },
    twitter: {
      title: "Brain Stack - We Build Digital Products People Love",
      description:
        "Full stack development, mobile apps, AI integration, and SaaS engineering for startups and enterprises. See how Brain Stack ships digital products that scale.",
    },
    alternates: {
      canonical: "https://brainstack.dev",
    },
  },
  about: {
    title: "About Brain Stack - Full Stack & AI Software Studio",
    description:
      "Learn about Brain Stack's mission, process, and the team behind our full stack, mobile, and AI engineering work for clients across the US, UK, and Europe.",
    keywords: [
      "Brain Stack",
      "software studio",
      "product engineering team",
      "AI development company",
      "digital transformation partner",
      "company culture",
      "engineering process",
    ],
    openGraph: {
      title: "About Brain Stack - Full Stack & AI Software Studio",
      description:
        "Learn about Brain Stack's mission, process, and the team behind our full stack, mobile, and AI engineering work for clients across the US, UK, and Europe.",
      url: "https://brainstack.dev/about",
      type: "website",
    },
    twitter: {
      title: "About Brain Stack - Full Stack & AI Software Studio",
      description:
        "Learn about Brain Stack's mission, process, and the team behind our full stack, mobile, and AI engineering work for clients across the US, UK, and Europe.",
    },
    alternates: {
      canonical: "https://brainstack.dev/about",
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Brain Stack",
      "description":
        "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams — from MVP to scale.",
      "url": "https://brainstack.dev",
      "logo": "https://brainstack.dev/logo.png",
      "foundingDate": "2020",
      "numberOfEmployees": "10-50",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "sameAs": [
        "https://linkedin.com/company/brainstack",
        "https://twitter.com/brainstack"
      ],
      "knowsAbout": [
        "Full Stack Development",
        "Mobile App Development",
        "Artificial Intelligence",
        "SaaS Engineering",
        "Cloud & DevOps",
        "Product Engineering"
      ]
    }
  },
  blog: {
    title: "Insights - Brain Stack Blog",
    description:
      "Engineering notes, product strategy, and AI insights from the Brain Stack team — for founders and product leaders building modern software.",
    keywords: [
      "software engineering blog",
      "AI insights",
      "product engineering",
      "digital transformation",
      "SaaS development articles",
      "technology insights",
    ],
    openGraph: {
      title: "Insights - Brain Stack Blog",
      description:
        "Engineering notes, product strategy, and AI insights from the Brain Stack team — for founders and product leaders building modern software.",
      url: "https://brainstack.dev/blog",
      type: "website",
    },
    twitter: {
      title: "Insights - Brain Stack Blog",
      description:
        "Engineering notes, product strategy, and AI insights from the Brain Stack team — for founders and product leaders building modern software.",
    },
    alternates: {
      canonical: "https://brainstack.dev/blog",
    },
  },
};

export function generatePageMetadata(
  page: keyof typeof pageMetadata,
  customMetadata?: Partial<Metadata>
): Metadata {
  const baseMetadata = pageMetadata[page];

  return {
    title: baseMetadata.title,
    description: baseMetadata.description,
    keywords: baseMetadata.keywords,
    openGraph: {
      ...siteConfig.openGraph,
      ...baseMetadata.openGraph,
    },
    twitter: {
      ...siteConfig.twitter,
      ...baseMetadata.twitter,
    },
    alternates: baseMetadata.alternates,
    robots: siteConfig.robots,
    verification: siteConfig.verification,
    ...customMetadata,
  };
}

export function generateBlogPostMetadata(
  title: string,
  description: string,
  publishedTime: string,
  slug: string,
  image?: string
): Metadata {
  const blogUrl = `https://brainstack.dev/blog/${slug}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: `${title} - Brain Stack Blog`,
    description,
    keywords: [
      ...siteConfig.keywords,
      "engineering blog post",
      "AI insights article",
      "product engineering notes"
    ],
    openGraph: {
      ...siteConfig.openGraph,
      title: `${title} - Brain Stack Blog`,
      description,
      url: blogUrl,
      type: "article",
      publishedTime,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...siteConfig.twitter,
      title: `${title} - Brain Stack Blog`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: blogUrl,
    },
    robots: siteConfig.robots,
  };
}

export function generateBlogPostStructuredData(
  title: string,
  description: string,
  publishedTime: string,
  slug: string,
  author?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    datePublished: publishedTime,
    dateModified: publishedTime,
    description,
    url: `https://brainstack.dev/blog/${slug}`,
    author: {
      "@type": "Person",
      name: author || "Brain Stack Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Brain Stack",
      logo: {
        "@type": "ImageObject",
        url: siteConfig.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://brainstack.dev/blog/${slug}`,
    },
  };
}

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
  // appLinks: [],
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

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  robots: siteConfig.robots,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  verification: siteConfig.verification,
  alternates: siteConfig.alternates,
  category: siteConfig.category,
  icons: {
    icon: [
      { url: "/favicon-dark.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-white.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};
