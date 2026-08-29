/**
 * Each homepage section's actual data now lives in its own file — hero.ts,
 * who-are-we.ts, team.ts, services.ts, projects.ts (also holds
 * projectVideoData), process.ts, testimonials.ts, faq.ts, cta.ts — so every
 * section can be edited from one dedicated place. This barrel exists purely
 * so existing imports ("@/lib/data/home-page") keep working unchanged, since
 * every homepage section component still imports from here.
 */
export { heroBannerData, type HeroBannerData } from "./hero"
export { whoWeAreData, type WhoWeAreData } from "./who-are-we"
export { foundersData, type FoundersData } from "./team"
export { servicesData, type ServicesData } from "./services"
export { projectVideoData, type ProjectVideoData } from "./projects"
export { processData, type ProcessData } from "./process"
export { testimonialsData, type TestimonialsData } from "./testimonials"
export { faqData, type FaqData } from "./faq"
export { ctaData, type CtaData } from "./cta"
