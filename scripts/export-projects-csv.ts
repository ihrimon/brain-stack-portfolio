import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { projectsData } from "../lib/data/projects-page"
import { JSON_ARRAY_COLUMNS, JSON_OBJECT_COLUMNS, PROJECTS_SHEET_COLUMNS } from "../lib/utils/sheets"

const JSON_COLUMNS = new Set<string>([...JSON_ARRAY_COLUMNS, ...JSON_OBJECT_COLUMNS])

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = projectsData.projects.map((project) => {
  const record = project as unknown as Record<string, unknown>

  return PROJECTS_SHEET_COLUMNS.map((column) => {
    const value = record[column]
    if (value === null || value === undefined) return ""
    const text = JSON_COLUMNS.has(column) ? JSON.stringify(value) : String(value)
    return csvEscape(text)
  }).join(",")
})

const csv = [PROJECTS_SHEET_COLUMNS.join(","), ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./projects-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${projectsData.projects.length} projects to ${outputPath}`)
