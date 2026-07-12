import BlogDetails from "@/components/sections/BlogDetails"
import { blogsData } from "@/lib/data/blogs"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogsData.posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = blogsData.posts.find((item) => item.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main id="main-content" role="main">
      <BlogDetails post={post} />
    </main>
  )
}
