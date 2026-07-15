import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import {
  ctaData,
  heroBannerData,
  processData,
  projectVideoData,
  servicesData,
  testimonialsData,
  whoWeAreData,
} from "../lib/data/home-page"
import { HOME_SHEET_KEYS } from "../lib/utils/sheets/home"

const SECTIONS: Record<(typeof HOME_SHEET_KEYS)[number], unknown> = {
  heroBanner: heroBannerData,
  projectVideo: projectVideoData,
  whoWeAre: whoWeAreData,
  services: servicesData,
  process: processData,
  testimonials: testimonialsData,
  cta: ctaData,
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = HOME_SHEET_KEYS.map(
  (key) => `${key},${csvEscape(JSON.stringify(SECTIONS[key]))}`
)

const csv = ["key,value", ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./home-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${HOME_SHEET_KEYS.length} sections to ${outputPath}`)
