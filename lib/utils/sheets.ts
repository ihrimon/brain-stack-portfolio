import { projectsData, type Project } from "@/lib/data/projects-page"
import { google } from "googleapis"

const SHEET_TAB = "Projects"
const SHEET_RANGE = `${SHEET_TAB}!A2:AH`

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
  "service",
  "duration",
  "date",
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

const EMPTY_CHALLENGE: NonNullable<Project["challenge"]> = {
  title: null,
  description: "",
  painPoints: [],
  businessImpact: [],
}

const EMPTY_SOLUTION: Project["solution"] = {
  title: "",
  description: "",
  highlights: [],
}

const EMPTY_METRICS: NonNullable<Project["metrics"]> = {
  performance: "",
  seo: "",
  accessibility: "",
  bestPractices: "",
}

const EMPTY_TESTIMONIAL: NonNullable<Project["testimonial"]> = {
  name: "",
  role: "",
  company: "",
  quote: "",
  image: "",
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

/**
 * Like parseJson, but for object-shaped cells (challenge/solution/metrics/testimonial).
 * Merges over the fallback shape instead of replacing it outright, so a row written
 * against an older column schema (missing a since-renamed field, e.g. "highlights")
 * degrades to that one field's default instead of leaving it `undefined` and crashing
 * the page that reads it.
 */
function parseJsonObject<T extends object>(value: string | undefined, fallback: T): T {
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

function rowToProject(row: string[]): Project | null {
  const cell = (name: (typeof COLUMNS)[number]) => row[COLUMNS.indexOf(name)]?.trim() ?? ""

  const slug = cell("slug")
  const title = cell("title")
  if (!slug || !title) return null

  const liveUrl = cell("liveUrl")
  const thumbnail = cell("thumbnail")
  const service = cell("service")
  const duration = cell("duration")
  const date = cell("date")
  const status = cell("status")

  return {
    id: cell("id"),
    slug,
    title,
    shortTitle: cell("shortTitle") || title,
    category: cell("category"),
    industry: cell("industry"),
    client: cell("client"),
    service: service ? service : null,
    duration: duration ? duration : null,
    date: date ? date : null,
    status: status ? status : null,
    liveUrl: liveUrl ? liveUrl : null,

    thumbnail,
    heroImage: cell("heroImage") || thumbnail,
    gallery: parseJson<string[]>(cell("gallery"), []),

    overview: cell("overview"),

    challenge: parseJsonObject(cell("challenge"), EMPTY_CHALLENGE),
    goals: parseJson<string[]>(cell("goals"), []),
    solution: parseJsonObject(cell("solution"), EMPTY_SOLUTION),
    workflow: parseJson<Project["workflow"]>(cell("workflow"), []),

    technologies: parseJson<string[]>(cell("technologies"), []),
    tools: parseJson<string[]>(cell("tools"), []),
    architecture: parseJson<string[]>(cell("architecture"), []),
    features: parseJson<string[]>(cell("features"), []),
    uiHighlights: parseJson<string[]>(cell("uiHighlights"), []),
    developmentProcess: parseJson<string[]>(cell("developmentProcess"), []),
    challengesFaced: parseJson<string[]>(cell("challengesFaced"), []),
    solutionsImplemented: parseJson<string[]>(cell("solutionsImplemented"), []),
    results: parseJson<string[]>(cell("results"), []),

    metrics: parseJsonObject(cell("metrics"), EMPTY_METRICS),
    testimonial: parseJsonObject(cell("testimonial"), EMPTY_TESTIMONIAL),

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
 * Fetches projects (portfolio work + in-depth case studies, merged into one
 * schema) from the "Projects" tab of the configured Google Sheet. Falls back
 * to the local lib/data/projects-page.ts seed data when credentials aren't
 * configured or the request fails, so the site keeps working before Sheets
 * access is set up and stays resilient to API outages.
 */
export async function getProjects(): Promise<Project[]> {
  const auth = getAuth()
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  if (!auth || !spreadsheetId) {
    console.warn(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local projects data."
    )
    return projectsData.projects
  }

  try {
    const sheets = google.sheets({ version: "v4", auth })
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE,
    })

    const rows = res.data.values ?? []
    const projects = rows
      .map((row) => rowToProject(row as string[]))
      .filter((item): item is Project => item !== null)

    return projects.length > 0 ? projects : projectsData.projects
  } catch (error) {
    console.error("[sheets] Failed to fetch projects from Google Sheets:", error)
    return projectsData.projects
  }
}

export { COLUMNS as PROJECTS_SHEET_COLUMNS, JSON_ARRAY_COLUMNS, JSON_OBJECT_COLUMNS }
