import { JsonLd } from "@/components/common/JsonLd"
import BlogDetails from "@/components/sections/BlogDetails"
import { blogsData } from "@/lib/data/blog-page"
import { generateBlogPostMetadata } from "@/lib/metadata"
import { generateBlogPostingSchema } from "@/lib/structured-data"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogsData.posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogsData.posts.find((item) => item.slug === slug)

  if (!post) return {}

  return generateBlogPostMetadata(post.title, post.excerpt, post.publishDate, post.slug, post.featuredImage)
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const posts = blogsData.posts
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <JsonLd data={generateBlogPostingSchema(post)} />
      <main id="main-content" role="main">
        <BlogDetails post={post} relatedPosts={relatedPosts} />
      </main>
    </>
  )
}
