import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  aboutApproachData,
  aboutFeaturesData,
  aboutInquiryData,
  aboutMissionData,
  aboutStatsData,
  teamMembersData,
  whyChooseUsData,
} from "../lib/data/about-page"
import { ABOUT_SHEET_KEYS } from "../lib/utils/sheets/about"

const SECTIONS: Record<(typeof ABOUT_SHEET_KEYS)[number], unknown> = {
  mission: aboutMissionData,
  stats: aboutStatsData,
  features: aboutFeaturesData,
  approach: aboutApproachData,
  inquiry: aboutInquiryData,
  whyChooseUs: whyChooseUsData,
  team: teamMembersData,
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = ABOUT_SHEET_KEYS.map(
  (key) => `${key},${csvEscape(JSON.stringify(SECTIONS[key]))}`
)

const csv = ["key,value", ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./about-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${ABOUT_SHEET_KEYS.length} sections to ${outputPath}`)
