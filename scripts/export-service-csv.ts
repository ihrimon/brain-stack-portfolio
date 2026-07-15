import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  agencyBannerData,
  exclusiveServicesData,
  serviceProcessData,
  serviceSpotlightData,
} from "../lib/data/service-page"
import { SERVICE_SHEET_KEYS } from "../lib/utils/sheets/service"

const SECTIONS: Record<(typeof SERVICE_SHEET_KEYS)[number], unknown> = {
  spotlight: serviceSpotlightData,
  process: serviceProcessData,
  exclusiveServices: exclusiveServicesData,
  banner: agencyBannerData,
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = SERVICE_SHEET_KEYS.map(
  (key) => `${key},${csvEscape(JSON.stringify(SECTIONS[key]))}`
)

const csv = ["key,value", ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./service-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${SERVICE_SHEET_KEYS.length} sections to ${outputPath}`)
