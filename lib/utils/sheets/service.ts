import {
  agencyBannerData,
  exclusiveServicesData,
  serviceProcessData,
  serviceSpotlightData,
  type AgencyBannerData,
  type ExclusiveServicesData,
  type ServiceProcessData,
  type ServiceSpotlightData,
} from "@/lib/data/service-page"
import { fetchKeyValueTab, parseJson, parseJsonObject } from "./shared"

const SHEET_TAB = "Services"

export interface ServiceSheetData {
  spotlight: ServiceSpotlightData
  process: ServiceProcessData
  exclusiveServices: ExclusiveServicesData
  banner: AgencyBannerData
}

const FALLBACK: ServiceSheetData = {
  spotlight: serviceSpotlightData,
  process: serviceProcessData,
  exclusiveServices: exclusiveServicesData,
  banner: agencyBannerData,
}

/**
 * Fetches every Services-page section from the 2-column "key | value"
 * Services tab. `spotlight` is a bare array (not an object), so it's parsed
 * with parseJson — every other section is parsed with parseJsonObject.
 */
export async function getServiceData(): Promise<ServiceSheetData> {
  try {
    const map = await fetchKeyValueTab(SHEET_TAB)
    if (!map) {
      console.warn(
        "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local service-page data."
      )
      return FALLBACK
    }

    return {
      spotlight: parseJson(map.spotlight, FALLBACK.spotlight),
      process: parseJsonObject(map.process, FALLBACK.process),
      exclusiveServices: parseJsonObject(map.exclusiveServices, FALLBACK.exclusiveServices),
      banner: parseJsonObject(map.banner, FALLBACK.banner),
    }
  } catch (error) {
    console.error(`[sheets] Failed to fetch "${SHEET_TAB}" tab from Google Sheets:`, error)
    return FALLBACK
  }
}

export const SERVICE_SHEET_KEYS = ["spotlight", "process", "exclusiveServices", "banner"] as const
