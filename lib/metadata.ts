import type { Metadata } from "next";
import { contactData } from "@/lib/constants/contact";

export const siteConfig = {
  name: "Brain Stack",
  description:
    "Brain Stack is a full-stack software studio building web, mobile, and AI-powered products for ambitious teams — from MVP to scale.",
  url: "https://brainstack.dev",
  ogImage: "https://res.cloudinary.com/dieth2xb3/image/upload/v1755799085/ssimage_bxr8i6.png",
  // Was "/logo.jpeg" — that file doesn't exist in public/. Fixed 2026-07-18
  // while wiring structured data, which needs a real, resolvable logo URL.
  logo: "/logo-dark.png",
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
      "sameAs": contactData.socials.map((social) => social.href),
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
  services: {
    title: "Services - Brain Stack | Full Stack, Mobile & AI Development",
    description:
      "From branding and UX/UI to full-stack web, mobile, and AI/automation development — see the services Brain Stack delivers for ambitious teams.",
    keywords: [
      "software development services",
      "full stack development",
      "mobile app development",
      "AI and automation services",
      "UX UI design",
      "branding and identity",
    ],
    openGraph: {
      title: "Services - Brain Stack | Full Stack, Mobile & AI Development",
      description:
        "From branding and UX/UI to full-stack web, mobile, and AI/automation development — see the services Brain Stack delivers for ambitious teams.",
      url: "https://brainstack.dev/services",
      type: "website",
    },
    twitter: {
      title: "Services - Brain Stack | Full Stack, Mobile & AI Development",
      description:
        "From branding and UX/UI to full-stack web, mobile, and AI/automation development — see the services Brain Stack delivers for ambitious teams.",
    },
    alternates: {
      canonical: "https://brainstack.dev/services",
    },
  },
  projects: {
    title: "Projects - Brain Stack | Case Studies & Portfolio",
    description:
      "SaaS platforms, AI products, marketplaces, and browser extensions — explore the case studies and portfolio work Brain Stack has shipped for clients worldwide.",
    keywords: [
      "software development portfolio",
      "SaaS case studies",
      "AI product case studies",
      "web development portfolio",
      "client project showcase",
    ],
    openGraph: {
      title: "Projects - Brain Stack | Case Studies & Portfolio",
      description:
        "SaaS platforms, AI products, marketplaces, and browser extensions — explore the case studies and portfolio work Brain Stack has shipped for clients worldwide.",
      url: "https://brainstack.dev/projects",
      type: "website",
    },
    twitter: {
      title: "Projects - Brain Stack | Case Studies & Portfolio",
      description:
        "SaaS platforms, AI products, marketplaces, and browser extensions — explore the case studies and portfolio work Brain Stack has shipped for clients worldwide.",
    },
    alternates: {
      canonical: "https://brainstack.dev/projects",
    },
  },
  contact: {
    title: "Contact Brain Stack - Start Your Project",
    description:
      "Tell us about your project. Brain Stack responds within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
    keywords: [
      "contact software development agency",
      "start a software project",
      "hire full stack developers",
      "AI development consultation",
    ],
    openGraph: {
      title: "Contact Brain Stack - Start Your Project",
      description:
        "Tell us about your project. Brain Stack responds within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
      url: "https://brainstack.dev/contact",
      type: "website",
    },
    twitter: {
      title: "Contact Brain Stack - Start Your Project",
      description:
        "Tell us about your project. Brain Stack responds within one business day with a clear, honest take on scope, timeline, and how we'd approach it.",
    },
    alternates: {
      canonical: "https://brainstack.dev/contact",
    },
  },
};

export function generatePageMetadata(
  page: keyof typeof pageMetadata,
  customMetadata?: Partial<Metadata>
): Metadata {
  const baseMetadata = pageMetadata[page];

  return {
    // `absolute` bypasses the root layout's `%s - Brain Stack` title template —
    // these per-page titles already include the brand name, so without this
    // every page would render as "<title> - Brain Stack" twice over.
    title: { absolute: baseMetadata.title },
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
  const fullTitle = `${title} - Brain Stack Blog`;

  return {
    // `absolute` bypasses the root layout's title template — see generatePageMetadata.
    title: { absolute: fullTitle },
    description,
    keywords: [
      ...siteConfig.keywords,
      "engineering blog post",
      "AI insights article",
      "product engineering notes"
    ],
    openGraph: {
      ...siteConfig.openGraph,
      title: fullTitle,
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
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: blogUrl,
    },
    robots: siteConfig.robots,
  };
}

export function generateProjectMetadata(
  title: string,
  description: string,
  slug: string,
  image?: string
): Metadata {
  const projectUrl = `https://brainstack.dev/projects/${slug}`;
  const ogImage = image || siteConfig.ogImage;
  const fullTitle = `${title} - Brain Stack Projects`;

  return {
    // `absolute` bypasses the root layout's title template — see generatePageMetadata.
    title: { absolute: fullTitle },
    description,
    keywords: [
      ...siteConfig.keywords,
      "case study",
      "client project",
      "software development portfolio",
    ],
    openGraph: {
      ...siteConfig.openGraph,
      title: fullTitle,
      description,
      url: projectUrl,
      type: "website",
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
      title: fullTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: projectUrl,
    },
    robots: siteConfig.robots,
  };
}

// JSON-LD structured data (Organization, WebSite, WebPage, BlogPosting,
// CreativeWork, BreadcrumbList) lives in lib/structured-data.ts, not here —
// this file is scoped to the Next.js Metadata API (<title>/<meta>/OG tags).
// A `generateBlogPostStructuredData` function used to live here; it's been
// superseded by `generateBlogPostingSchema` in that file (more complete —
// adds image/keywords/isPartOf — and reuses this file's siteConfig via an
// import rather than hardcoding the domain a second time).

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
