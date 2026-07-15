import { google } from "googleapis"

export function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY

  if (!clientEmail || !privateKey) return null

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })
}

export function getSheetsClient() {
  const auth = getAuth()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID
  if (!auth || !spreadsheetId) return null

  return { sheets: google.sheets({ version: "v4", auth }), spreadsheetId }
}

export function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    console.warn(`[sheets] Could not parse JSON cell, using fallback. Value: ${value.slice(0, 80)}`)
    return fallback
  }
}

/**
 * Like parseJson, but for object-shaped cells. Merges over the fallback shape
 * instead of replacing it outright, so a cell written against an older schema
 * (missing a since-renamed field) degrades to that one field's default
 * instead of leaving it `undefined` and crashing the page that reads it.
 */
export function parseJsonObject<T extends object>(value: string | undefined, fallback: T): T {
  if (!value || !value.trim()) return fallback

  try {
    const parsed = JSON.parse(value)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback
    return { ...fallback, ...parsed }
  } catch {
    console.warn(`[sheets] Could not parse JSON cell, using fallback. Value: ${value.slice(0, 80)}`)
    return fallback
  }
}

/**
 * Reads a 2-column "key | value" tab (used by Home/About/Service — a handful
 * of differently-shaped singleton sections, not a repeating list) into a
 * plain key -> raw-cell-string map. Each value cell is expected to hold one
 * section's full data as a JSON blob, parsed by the caller via
 * parseJsonObject against that section's own default shape.
 */
export async function fetchKeyValueTab(
  tab: string
): Promise<Record<string, string> | null> {
  const client = getSheetsClient()
  if (!client) return null

  const res = await client.sheets.spreadsheets.values.get({
    spreadsheetId: client.spreadsheetId,
    range: `${tab}!A2:B`,
  })

  const rows = res.data.values ?? []
  const map: Record<string, string> = {}

  for (const row of rows) {
    const key = row[0]?.trim()
    if (!key) continue
    map[key] = row[1] ?? ""
  }

  return map
}
