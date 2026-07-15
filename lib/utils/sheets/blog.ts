import { blogsData, type BlogContentBlock, type BlogPost } from "@/lib/data/blog-page"
import { getSheetsClient, parseJson } from "./shared"

const SHEET_TAB = "Blog"
const SHEET_RANGE = `${SHEET_TAB}!A2:J`

// Column order the Google Sheet is expected to follow (row 1 = header, data from row 2).
const COLUMNS = [
  "slug",
  "title",
  "excerpt",
  "category",
  "author",
  "comments",
  "publishDate",
  "featuredImage",
  "tags",
  "content",
] as const

function rowToPost(row: string[]): BlogPost | null {
  const cell = (name: (typeof COLUMNS)[number]) => row[COLUMNS.indexOf(name)]?.trim() ?? ""

  const slug = cell("slug")
  const title = cell("title")
  if (!slug || !title) return null

  return {
    slug,
    title,
    excerpt: cell("excerpt"),
    category: cell("category"),
    author: cell("author"),
    comments: Number(cell("comments")) || 0,
    publishDate: cell("publishDate"),
    featuredImage: cell("featuredImage"),
    tags: parseJson<string[]>(cell("tags"), []),
    content: parseJson<BlogContentBlock[]>(cell("content"), []),
  }
}

/**
 * Fetches blog posts from the "Blog" tab of the configured Google Sheet — one
 * row per post, same tabular shape as the Projects sheet. Falls back to the
 * local lib/data/blog-page.ts seed data when credentials aren't configured or
 * the request fails.
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const client = getSheetsClient()

  if (!client) {
    console.warn(
      "[sheets] GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY or GOOGLE_SHEET_ID is not set — using local blog-page data."
    )
    return [...blogsData.posts]
  }

  try {
    const res = await client.sheets.spreadsheets.values.get({
      spreadsheetId: client.spreadsheetId,
      range: SHEET_RANGE,
    })

    const rows = res.data.values ?? []
    const posts = rows
      .map((row) => rowToPost(row as string[]))
      .filter((item): item is BlogPost => item !== null)

    return posts.length > 0 ? posts : [...blogsData.posts]
  } catch (error) {
    console.error(`[sheets] Failed to fetch "${SHEET_TAB}" tab from Google Sheets:`, error)
    return [...blogsData.posts]
  }
}

export { COLUMNS as BLOG_SHEET_COLUMNS }
