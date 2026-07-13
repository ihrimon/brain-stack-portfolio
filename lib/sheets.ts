import { caseStudiesData, type CaseStudy } from "@/lib/data/caseStudies"
import { google } from "googleapis"

const SHEET_TAB = "CaseStudies"
const SHEET_RANGE = `${SHEET_TAB}!A2:AF`

// Column order the Google Sheet is expected to follow (row 1 = header, data from row 2).
// Simple fields are plain cells; nested arrays/objects are JSON text in a single cell.
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

const JSON_ARRAY_COLUMNS = new Set([
  "gallery",
  "goals",
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
  "lessonsLearned",
  "nextSteps",
  "relatedProjects",
])

const JSON_OBJECT_COLUMNS = new Set(["challenge", "solution", "metrics", "testimonial"])

const EMPTY_CHALLENGE: CaseStudy["challenge"] = {
  title: "",
  description: "",
  painPoints: [],
  businessImpact: [],
}

const EMPTY_SOLUTION: CaseStudy["solution"] = {
  title: "",
  description: "",
  keySolutions: [],
}

const EMPTY_METRICS: CaseStudy["metrics"] = {
  performance: "",
  seo: "",
  accessibility: "",
  bestPractices: "",
}

const EMPTY_TESTIMONIAL: CaseStudy["testimonial"] = {
  name: "",
  designation: "",
  company: "",
  quote: "",
  avatar: "",
}

function parseJson<T>(value: string | undefined, fallback: T): T {
  if (!value || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    console.warn(`[sheets] Could not parse JSON cell, using fallback. Value: ${value.slice(0, 80)}`)
    return fallback
  }
}

function rowToCaseStudy(row: string[]): CaseStudy | null {
  const cell = (name: (typeof COLUMNS)[number]) => row[COLUMNS.indexOf(name)]?.trim() ?? ""

  const slug = cell("slug")
  const title = cell("title")
  if (!slug || !title) return null

  const liveUrl = cell("liveUrl")
  const thumbnail = cell("thumbnail")

  return {
    id: cell("id"),
    slug,
    title,
    shortTitle: cell("shortTitle") || title,
    category: cell("category"),
    industry: cell("industry"),
    client: cell("client"),
    duration: cell("duration"),
    status: cell("status"),
    liveUrl: liveUrl ? liveUrl : null,

    thumbnail,
    heroImage: cell("heroImage") || thumbnail,
    gallery: parseJson<string[]>(cell("gallery"), []),

    overview: cell("overview"),

    challenge: parseJson(cell("challenge"), EMPTY_CHALLENGE),
    goals: parseJson<string[]>(cell("goals"), []),
    solution: parseJson(cell("solution"), EMPTY_SOLUTION),
    workflow: parseJson<CaseStudy["workflow"]>(cell("workflow"), []),

    technologies: parseJson<string[]>(cell("technologies"), []),
    tools: parseJson<string[]>(cell("tools"), []),
    architecture: parseJson<string[]>(cell("architecture"), []),
    features: parseJson<string[]>(cell("features"), []),
    uiHighlights: parseJson<string[]>(cell("uiHighlights"), []),
    developmentProcess: parseJson<string[]>(cell("developmentProcess"), []),
    challengesFaced: parseJson<string[]>(cell("challengesFaced"), []),
    solutionsImplemented: parseJson<string[]>(cell("solutionsImplemented"), []),
    results: parseJson<string[]>(cell("results"), []),

    metrics: parseJson(cell("metrics"), EMPTY_METRICS),
    testimonial: parseJson(cell("testimonial"), EMPTY_TESTIMONIAL),

    lessonsLearned: parseJson<string[]>(cell("lessonsLearned"), []),
    nextSteps: parseJson<string[]>(cell("nextSteps"), []),
    relatedProjects: parseJson<string[]>(cell("relatedProjects"), []),
  }
}

function getAuth() {
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

/**
 * Fetches case studies from the "CaseStudies" tab of the configured Google
 * Sheet. Falls back to the local lib/data/caseStudies.ts seed data when
 * credentials aren't configured or the request fails, so the site keeps
 * working before Sheets access is set up and stays resilient to API outages.
 */
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const auth = getAuth()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!auth || !spreadsheetId) {
    console.warn(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local case studies data."
    )
    return caseStudiesData
  }

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE,
    })

    const rows = res.data.values ?? []
    const caseStudies = rows
      .map((row) => rowToCaseStudy(row as string[]))
      .filter((item): item is CaseStudy => item !== null)

    return caseStudies.length > 0 ? caseStudies : caseStudiesData
  } catch (error) {
    console.error("[sheets] Failed to fetch case studies from Google Sheets:", error)
    return caseStudiesData
  }
}

export { COLUMNS as CASE_STUDIES_SHEET_COLUMNS, JSON_ARRAY_COLUMNS, JSON_OBJECT_COLUMNS }
