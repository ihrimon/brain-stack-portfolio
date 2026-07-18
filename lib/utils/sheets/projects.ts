import {
  projectsData,
  type BaseProject,
  type CaseStudyProject,
  type Project,
  type ProjectMetrics,
  type ProjectWorkflowStep,
} from "@/lib/data/projects-page"
import type { Testimonial } from "@/lib/data/shared-types"
import { getSheetsClient, parseJson, parseJsonObject, withRetry } from "./shared"

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

const EMPTY_CHALLENGE: BaseProject["challenge"] = {
  title: null,
  description: "",
  painPoints: [],
  businessImpact: [],
}

const EMPTY_SOLUTION: BaseProject["solution"] = {
  title: "",
  description: "",
  highlights: [],
}

const EMPTY_METRICS: ProjectMetrics = {
  performance: "",
  seo: "",
  accessibility: "",
  bestPractices: "",
}

const EMPTY_TESTIMONIAL: Testimonial = {
  name: "",
  role: "",
  company: "",
  quote: "",
  image: "",
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

  const base: BaseProject = {
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
    technologies: parseJson<string[]>(cell("technologies"), []),
    tools: parseJson<string[]>(cell("tools"), []),

    challenge: parseJsonObject(cell("challenge"), EMPTY_CHALLENGE),
    solution: parseJsonObject(cell("solution"), EMPTY_SOLUTION),
  }

  // The sheet has no explicit "is this a full case study" column — every
  // deep-dive field is just a JSON cell that's either populated or empty.
  // Classify from the parsed content instead: any real narrative/metrics/
  // testimonial signal means this row is a case study, not just a portfolio
  // card. Mirrors the same distinction already present in the seed data
  // (lib/data/projects-page.ts).
  const goals = parseJson<string[]>(cell("goals"), [])
  const workflow = parseJson<ProjectWorkflowStep[]>(cell("workflow"), [])
  const architecture = parseJson<string[]>(cell("architecture"), [])
  const features = parseJson<string[]>(cell("features"), [])
  const uiHighlights = parseJson<string[]>(cell("uiHighlights"), [])
  const developmentProcess = parseJson<string[]>(cell("developmentProcess"), [])
  const challengesFaced = parseJson<string[]>(cell("challengesFaced"), [])
  const solutionsImplemented = parseJson<string[]>(cell("solutionsImplemented"), [])
  const results = parseJson<string[]>(cell("results"), [])
  const lessonsLearned = parseJson<string[]>(cell("lessonsLearned"), [])
  const nextSteps = parseJson<string[]>(cell("nextSteps"), [])
  const relatedProjects = parseJson<string[]>(cell("relatedProjects"), [])
  const metrics = parseJson<ProjectMetrics | null>(cell("metrics"), null)
  const testimonial = parseJson<Testimonial | null>(cell("testimonial"), null)

  const isCaseStudy =
    workflow.length > 0 ||
    architecture.length > 0 ||
    features.length > 0 ||
    developmentProcess.length > 0 ||
    challengesFaced.length > 0 ||
    solutionsImplemented.length > 0 ||
    results.length > 0 ||
    metrics !== null ||
    testimonial !== null

  if (!isCaseStudy) {
    return { ...base, kind: "portfolio" }
  }

  const caseStudy: CaseStudyProject = {
    ...base,
    kind: "case-study",
    goals,
    workflow,
    architecture,
    features,
    uiHighlights,
    developmentProcess,
    challengesFaced,
    solutionsImplemented,
    results,
    metrics: metrics ?? EMPTY_METRICS,
    testimonial: testimonial ?? EMPTY_TESTIMONIAL,
    lessonsLearned,
    nextSteps,
    relatedProjects,
  }

  return caseStudy
}

/**
 * Fetches projects (portfolio work + in-depth case studies, merged into one
 * schema) from the "Projects" tab of the configured Google Sheet. Falls back
 * to the local lib/data/projects-page.ts seed data when credentials aren't
 * configured or the request fails, so the site keeps working before Sheets
 * access is set up and stays resilient to API outages.
 */
export async function getProjects(): Promise<Project[]> {
  const client = getSheetsClient()

  if (!client) {
    console.warn(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local projects data."
    )
    return projectsData.projects
  }

  try {
    const res = await withRetry(
      () =>
        client.sheets.spreadsheets.values.get({
          spreadsheetId: client.spreadsheetId,
          range: SHEET_RANGE,
        }),
      "getProjects"
    )

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
