import AllBlogs from "@/components/sections/AllBlogs"
import { generatePageMetadata } from "@/lib/metadata"
import { getBlogPosts } from "@/lib/utils/sheets/blog"

export const revalidate = 300
export const metadata = generatePageMetadata("blog")

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main id="main-content" role="main">
      <AllBlogs posts={posts} />
    </main>
  )
}
