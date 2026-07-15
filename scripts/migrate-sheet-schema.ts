/**
 * One-time migration: reads your existing Google Sheet tab (old CaseStudy
 * schema, 32 columns) and writes it into a NEW tab called "Projects" using
 * the new 34-column schema — inserting `service`/`date`, and renaming the
 * legacy JSON keys inside the `solution`/`testimonial` cells:
 *   solution.keySolutions   -> solution.highlights
 *   testimonial.designation -> testimonial.role
 *   testimonial.avatar      -> testimonial.image
 *
 * The original tab is left untouched — verify the new "Projects" tab looks
 * right in Sheets, then delete or rename the old one yourself.
 *
 * Requires GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID
 * in .env.local, and the service account must have Editor access on the
 * Sheet (not just Viewer — this script writes).
 *
 * Run with:  npx tsx scripts/migrate-sheet-schema.ts [old-tab-name]
 * (old-tab-name defaults to "CaseStudies")
 */

import { readFileSync } from "node:fs"
import { google } from "googleapis"
import { PROJECTS_SHEET_COLUMNS } from "../lib/utils/sheets"

// Minimal .env.local loader (avoids adding a dotenv dependency for one script).
try {
  const envFile = readFileSync(".env.local", "utf8")
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^"(.*)"$/, "$1")
    }
  }
} catch {
  // .env.local not found — rely on already-exported environment variables.
}

const OLD_TAB = process.argv[2] || "CaseStudies"
const NEW_TAB = "Projects"

function renameKeys(json: string, renames: Record<string, string>): string {
  if (!json || !json.trim()) return json

  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    return json
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json

  const record = parsed as Record<string, unknown>
  const next: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(record)) {
    const newKey = renames[key] ?? key
    next[newKey] = value
  }

  return JSON.stringify(next)
}

async function main() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!clientEmail || !privateKey || !spreadsheetId) {
    console.error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, or GOOGLE_SHEET_ID in .env.local"
    )
    process.exit(1)
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  const sheets = google.sheets({ version: "v4", auth })

  console.log(`Reading "${OLD_TAB}" ...`)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${OLD_TAB}!A1:AZ`,
  })

  const rows = res.data.values ?? []
  if (rows.length < 2) {
    console.error(`No data found in "${OLD_TAB}" (need a header row + at least one data row).`)
    process.exit(1)
  }

  const oldHeader = rows[0]
  const dataRows = rows.slice(1)
  const oldIndex = (name: string) => oldHeader.indexOf(name)

  const newRows = dataRows.map((row) => {
    const cell = (name: string) => {
      const i = oldIndex(name)
      return i === -1 ? "" : (row[i] ?? "")
    }

    const record: Record<string, string> = {}
    for (const column of PROJECTS_SHEET_COLUMNS) {
      record[column] = cell(column)
    }

    // Columns that didn't exist in the old schema — leave blank; fill in
    // manually in Sheets for rows that have a real service/date value.
    if (oldIndex("service") === -1) record.service = ""
    if (oldIndex("date") === -1) record.date = ""

    record.solution = renameKeys(record.solution, { keySolutions: "highlights" })
    record.testimonial = renameKeys(record.testimonial, {
      designation: "role",
      avatar: "image",
    })

    return PROJECTS_SHEET_COLUMNS.map((column) => record[column] ?? "")
  })

  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
  const existingTab = spreadsheet.data.sheets?.find(
    (sheet) => sheet.properties?.title === NEW_TAB
  )

  if (!existingTab) {
    console.log(`Creating "${NEW_TAB}" tab ...`)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: NEW_TAB } } }],
      },
    })
  } else {
    console.log(`"${NEW_TAB}" tab already exists — its contents will be overwritten.`)
  }

  console.log(`Writing header + ${newRows.length} row(s) to "${NEW_TAB}" ...`)
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${NEW_TAB}!A1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[...PROJECTS_SHEET_COLUMNS], ...newRows],
    },
  })

  console.log(
    `Done. Verify "${NEW_TAB}" in Sheets, then delete or rename "${OLD_TAB}" once you're happy with it.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
