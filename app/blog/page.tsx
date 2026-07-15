import AllBlogs from "@/components/sections/AllBlogs"
import { getBlogPosts } from "@/lib/utils/sheets/blog"

export const revalidate = 300

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <main id="main-content" role="main">
      <AllBlogs posts={posts} />
    </main>
  )
}
