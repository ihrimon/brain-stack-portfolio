"use client"

import { HeadingSection } from "@/components/common/HeadingSection"
import "@/lib/animations/gsap-animations"
import { blogsData, type BlogPost } from "@/lib/data/blog-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { CircleUserRound, Tag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

function formatDate(date: string, month: "long" | "short" = "long") {
  return new Date(date).toLocaleDateString("en-US", {
    month,
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
        <HeadingSection
          badge={blogsData.badge}
          title={blogsData.title}
          titleRef={titleRef}
          link={{ label: "View All Posts", href: "/blog" }}
        />

        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
          {posts.slice(0, 4).map((post) => (
            <article key={post.slug} className="group flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-4/5 w-full overflow-hidden rounded-2xl"
                data-cursor="magnetic"
              >
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </Link>

              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/50 sm:gap-4">
                <span className="hidden items-center gap-1.5 sm:flex">
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
                <span className="sm:hidden">{formatDate(post.publishDate, "short")}</span>
                <span className="hidden sm:inline">{formatDate(post.publishDate)}</span>
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
