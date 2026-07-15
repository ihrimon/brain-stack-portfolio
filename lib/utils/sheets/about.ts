import {
  aboutApproachData,
  aboutFeaturesData,
  aboutInquiryData,
  aboutMissionData,
  aboutStatsData,
  teamMembersData,
  whyChooseUsData,
  type AboutApproachData,
  type AboutFeaturesData,
  type AboutInquiryData,
  type AboutMissionData,
  type AboutStatsData,
  type TeamMembersData,
  type WhyChooseUsData,
} from "@/lib/data/about-page"
import { fetchKeyValueTab, parseJson, parseJsonObject } from "./shared"

const SHEET_TAB = "About"

export interface AboutSheetData {
  mission: AboutMissionData
  stats: AboutStatsData
  features: AboutFeaturesData
  approach: AboutApproachData
  inquiry: AboutInquiryData
  whyChooseUs: WhyChooseUsData
  team: TeamMembersData
}

const FALLBACK: AboutSheetData = {
  mission: aboutMissionData,
  stats: aboutStatsData,
  features: aboutFeaturesData,
  approach: aboutApproachData,
  inquiry: aboutInquiryData,
  whyChooseUs: whyChooseUsData,
  team: teamMembersData,
}

/**
 * Fetches every About-page section from the 2-column "key | value" About tab.
 * `stats` is a bare array (not an object), so it's parsed with parseJson —
 * every other section is parsed with parseJsonObject.
 */
export async function getAboutData(): Promise<AboutSheetData> {
  try {
    const map = await fetchKeyValueTab(SHEET_TAB)
    if (!map) {
      console.warn(
        "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local about-page data."
      )
      return FALLBACK
    }

    return {
      mission: parseJsonObject(map.mission, FALLBACK.mission),
      stats: parseJson(map.stats, FALLBACK.stats),
      features: parseJsonObject(map.features, FALLBACK.features),
      approach: parseJsonObject(map.approach, FALLBACK.approach),
      inquiry: parseJsonObject(map.inquiry, FALLBACK.inquiry),
      whyChooseUs: parseJsonObject(map.whyChooseUs, FALLBACK.whyChooseUs),
      team: parseJsonObject(map.team, FALLBACK.team),
    }
  } catch (error) {
    console.error(`[sheets] Failed to fetch "${SHEET_TAB}" tab from Google Sheets:`, error)
    return FALLBACK
  }
}

export const ABOUT_SHEET_KEYS = [
  "mission",
  "stats",
  "features",
  "approach",
  "inquiry",
  "whyChooseUs",
  "team",
] as const
