import {
  ctaData,
  heroBannerData,
  processData,
  projectVideoData,
  servicesData,
  testimonialsData,
  whoWeAreData,
  type CtaData,
  type HeroBannerData,
  type ProcessData,
  type ProjectVideoData,
  type ServicesData,
  type TestimonialsData,
  type WhoWeAreData,
} from "@/lib/data/home-page"
import { fetchKeyValueTab, parseJsonObject } from "./shared"

const SHEET_TAB = "Home"

export interface HomeSheetData {
  heroBanner: HeroBannerData
  projectVideo: ProjectVideoData
  whoWeAre: WhoWeAreData
  services: ServicesData
  process: ProcessData
  testimonials: TestimonialsData
  cta: CtaData
}

const FALLBACK: HomeSheetData = {
  heroBanner: heroBannerData,
  projectVideo: projectVideoData,
  whoWeAre: whoWeAreData,
  services: servicesData,
  process: processData,
  testimonials: testimonialsData,
  cta: ctaData,
}

/**
 * Fetches every Home-page section from the 2-column "key | value" Home tab
 * (key = section name, value = that section's full data as a JSON blob).
 * Falls back to the local lib/data/home-page.ts seed data when credentials
 * aren't configured or the request fails.
 */
export async function getHomeData(): Promise<HomeSheetData> {
  try {
    const map = await fetchKeyValueTab(SHEET_TAB)
    if (!map) {
      console.warn(
        "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local home-page data."
      )
      return FALLBACK
    }

    return {
      heroBanner: parseJsonObject(map.heroBanner, FALLBACK.heroBanner),
      projectVideo: parseJsonObject(map.projectVideo, FALLBACK.projectVideo),
      whoWeAre: parseJsonObject(map.whoWeAre, FALLBACK.whoWeAre),
      services: parseJsonObject(map.services, FALLBACK.services),
      process: parseJsonObject(map.process, FALLBACK.process),
      testimonials: parseJsonObject(map.testimonials, FALLBACK.testimonials),
      cta: parseJsonObject(map.cta, FALLBACK.cta),
    }
  } catch (error) {
    console.error(`[sheets] Failed to fetch "${SHEET_TAB}" tab from Google Sheets:`, error)
    return FALLBACK
  }
}

export const HOME_SHEET_KEYS = [
  "heroBanner",
  "projectVideo",
  "whoWeAre",
  "services",
  "process",
  "testimonials",
  "cta",
] as const
