import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { caseStudiesData } from "../lib/data/caseStudies"

const COLUMNS = [
  "id",
  "slug",
  "title",
  "shortTitle",
  "category",
  "industry",
  "client",
  "duration",
  "status",
  "liveUrl",
  "thumbnail",
  "heroImage",
  "gallery",
  "overview",
  "challenge",
  "goals",
  "solution",
  "workflow",
  "technologies",
  "tools",
  "architecture",
  "features",
  "uiHighlights",
  "developmentProcess",
  "challengesFaced",
  "solutionsImplemented",
  "results",
  "metrics",
  "testimonial",
  "lessonsLearned",
  "nextSteps",
  "relatedProjects",
] as const

const JSON_COLUMNS = new Set<(typeof COLUMNS)[number]>([
  "gallery",
  "challenge",
  "goals",
  "solution",
  "workflow",
  "technologies",
  "tools",
  "architecture",
  "features",
  "uiHighlights",
  "developmentProcess",
  "challengesFaced",
  "solutionsImplemented",
  "results",
  "metrics",
  "testimonial",
  "lessonsLearned",
  "nextSteps",
  "relatedProjects",
])

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = caseStudiesData.map((caseStudy) => {
  const record = caseStudy as unknown as Record<string, unknown>

  return COLUMNS.map((column) => {
    const value = record[column]
    if (value === null || value === undefined) return ""
    const text = JSON_COLUMNS.has(column) ? JSON.stringify(value) : String(value)
    return csvEscape(text)
  }).join(",")
})

const csv = [COLUMNS.join(","), ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./case-studies-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${caseStudiesData.length} case studies to ${outputPath}`)
