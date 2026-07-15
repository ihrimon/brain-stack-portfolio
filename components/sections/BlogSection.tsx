"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/animations/gsap-animations"
import { blogsData, type BlogPost } from "@/lib/data/blog-page"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CircleUserRound, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

interface BlogSectionProps {
  posts: BlogPost[]
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="max-w-4xl">
          <SectionBadge>{blogsData.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {blogsData.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <article key={post.slug} className="group flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-4/5 w-full overflow-hidden rounded-3xl"
                data-cursor="magnetic"
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
                />
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1.5">
                  <CircleUserRound className="size-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Tag className="size-3.5" />
                  {post.category}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-semibold text-white">
                <Link
                  href={`/blog/${post.slug}`}
                  className="transition-colors duration-300 hover:text-white/80"
                  data-cursor="magnetic"
                >
                  {post.title}
                </Link>
              </h3>

              <p className="mt-3 flex items-center gap-2 text-xs text-white/40">
                <span>{formatDate(post.publishDate)}</span>
                <span className="size-1 rounded-full bg-white/30" />
                <span>
                  {post.comments.toString().padStart(2, "0")} Comments
                </span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
