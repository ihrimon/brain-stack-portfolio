// ---------------------------------------------------------------------------
// BLOG TEMPORARILY DISABLED. This folder is named `_blog`, and Next.js never
// routes underscore-prefixed ("private") folders, so every /blog URL is a
// real 404 while the code below stays intact and type-checked.
// To bring the blog back: rename `app/_blog` to `app/blog`, then uncomment
// the "Blog" entries in lib/constants/navigation.ts (and drop the About
// stand-in there) and the blog routes in app/sitemap.ts.
// ---------------------------------------------------------------------------

import { JsonLd } from "@/components/common/JsonLd"
import AllBlogs from "@/components/sections/AllBlogs"
import { blogsData } from "@/lib/data/blog-page"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

// See app/page.tsx for why this is explicit rather than implicit.
export const dynamic = "force-static"

export const metadata = generatePageMetadata("blog")

export default function BlogPage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("blog")} />
      <main id="main-content" role="main">
        <AllBlogs posts={blogsData.posts} />
      </main>
    </>
  )
}
