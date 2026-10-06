"use client"

import { blogsData, type BlogPost } from "@/lib/data/blog-page"
import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"

const PAGE_SIZE = 8

type Post = BlogPost

// Alternates 3-column and 2-column rows to match the site's editorial
// layout. Small counts get a hand-picked split instead of ending on an
// awkward single-card row; larger counts fall back to the 3/2 cycle.
function rowSizesFor(count: number): number[] {
  const presets: Record<number, number[]> = {
    1: [1],
    2: [2],
    3: [3],
    4: [2, 2],
    5: [3, 2],
    6: [3, 3],
    7: [3, 2, 2],
    8: [3, 2, 3],
  }

  if (presets[count]) return presets[count]

  const sizes: number[] = []
  const cycle = [3, 2]
  let remaining = count
  let index = 0

  while (remaining > 0) {
    const size = Math.min(cycle[index % cycle.length], remaining)
    sizes.push(size)
    remaining -= size
    index += 1
  }

  return sizes
}

function chunkRows(posts: Post[]): Post[][] {
  const sizes = rowSizesFor(posts.length)
  const rows: Post[][] = []
  let i = 0

  for (const size of sizes) {
    rows.push(posts.slice(i, i + size))
    i += size
  }

  return rows
}

interface AllBlogsProps {
  posts: BlogPost[]
}

export default function AllBlogs({ posts }: AllBlogsProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE))
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  const pagePosts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return posts.slice(start, start + PAGE_SIZE)
  }, [posts, page])

  const rows = useMemo(() => chunkRows(pagePosts), [pagePosts])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [page])

  return (
    <section
      ref={sectionRef}
      className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="mx-auto max-w-site px-4 lg:px-6">
        <h1 className="max-w-6xl text-4xl leading-tight font-medium tracking-tight text-white uppercase sm:text-5xl md:text-6xl">
          {blogsData.title}
        </h1>

        <div className="mt-16 space-y-14 sm:mt-20">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn(
                "grid gap-8 divide-white/10 sm:gap-10",
                row.length === 3 && "sm:grid-cols-3 sm:divide-x",
                row.length === 2 && "sm:grid-cols-2 sm:divide-x"
              )}
            >
              {row.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col sm:px-8 sm:first:pl-0 sm:last:pr-0"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-surface-dark"
                    data-cursor="magnetic"
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      priority={rowIndex === 0}
                      fetchPriority={rowIndex === 0 ? "high" : undefined}
                      placeholder={rowIndex === 0 ? undefined : "blur"}
                      blurDataURL={rowIndex === 0 ? undefined : BLUR_DATA_URL}
                    />
                  </Link>

                  <h3 className="mt-6 text-xl leading-snug font-semibold text-white sm:text-2xl">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors duration-300 hover:text-white/80"
                      data-cursor="magnetic"
                    >
                      {post.title}{" "}
                      <span className="ml-1 inline-flex size-6 -translate-y-0.5 items-center justify-center rounded-full border border-white/30 align-middle">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </Link>
                  </h3>

                  <p className="mt-4 text-sm text-white/40">
                    By{" "}
                    <span className="font-semibold text-white/70">
                      {post.author}
                    </span>{" "}
                    — {new Date(post.publishDate).getFullYear()}
                  </p>
                </article>
              ))}
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-cursor="magnetic"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  data-cursor="magnetic"
                  className={cn(
                    "flex size-11 cursor-pointer items-center justify-center rounded-full text-sm font-medium transition-colors duration-300",
                    page === pageNumber
                      ? "bg-white text-black"
                      : "border border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                  )}
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-cursor="magnetic"
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition-colors duration-300 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
