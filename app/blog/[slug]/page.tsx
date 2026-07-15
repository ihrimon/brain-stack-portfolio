import BlogDetails from "@/components/sections/BlogDetails"
import { getBlogPosts } from "@/lib/utils/sheets/blog"
import { notFound } from "next/navigation"

export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = await getBlogPosts()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <main id="main-content" role="main">
      <BlogDetails post={post} relatedPosts={relatedPosts} />
    </main>
  )
}
