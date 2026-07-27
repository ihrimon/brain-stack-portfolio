import { JsonLd } from "@/components/common/JsonLd"
import AllBlogs from "@/components/sections/AllBlogs"
import { blogsData } from "@/lib/data/blog-page"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

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
