import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { blogsData } from "../lib/data/blog-page"
import { BLOG_SHEET_COLUMNS } from "../lib/utils/sheets/blog"

const JSON_COLUMNS = new Set<string>(["tags", "content"])

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const rows = blogsData.posts.map((post) => {
  const record = post as unknown as Record<string, unknown>

  return BLOG_SHEET_COLUMNS.map((column) => {
    const value = record[column]
    if (value === null || value === undefined) return ""
    const text = JSON_COLUMNS.has(column) ? JSON.stringify(value) : String(value)
    return csvEscape(text)
  }).join(",")
})

const csv = [BLOG_SHEET_COLUMNS.join(","), ...rows].join("\n")

const outputPath = fileURLToPath(new URL("./blog-export.csv", import.meta.url))
writeFileSync(outputPath, csv, "utf8")

console.log(`Wrote ${blogsData.posts.length} posts to ${outputPath}`)
