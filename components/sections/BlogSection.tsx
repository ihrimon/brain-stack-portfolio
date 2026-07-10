"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import "@/lib/GSAPAnimations"
import { blogsData } from "@/lib/data/blogs"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowRight } from "lucide-react"
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

export default function BlogSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const posts = blogsData.posts.slice(0, 2)

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
        <div className="flex flex-col gap-6">
          <SectionBadge>{blogsData.badge}</SectionBadge>

          <h2
            ref={titleRef}
            className="mt-8 max-w-4xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
          >
            {blogsData.title}
          </h2>
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-20 sm:grid-cols-2">
          {posts.map((post, index) => (
            <div
              key={post.slug}
              className={cn("relative", index === 1 && "sm:mt-16")}
            >
              <div className="relative aspect-4/4 w-full overflow-hidden rounded-2xl sm:aspect-3/3">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 40vw, 90vw"
                />

                <div className="w-3.5/5 absolute right-0 bottom-0 rounded-tl-2xl bg-brand-dark p-5 sm:w-110 sm:p-6">
                  <p className="text-xs text-white/50">
                    <span>{post.category}</span>
                    <span className="mx-2">—</span>
                    <span>{formatDate(post.date)}</span>
                  </p>

                  <h3 className="mt-3 text-2xl font-medium text-white sm:text-xl">
                    {post.title}
                  </h3>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group inline-flex items-center gap-2 text-sm font-medium text-white"
                      data-cursor="magnetic"
                    >
                      Read More
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
