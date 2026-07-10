import { blogsData } from "@/lib/data/blogs"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function BlogSection() {
  const posts = blogsData.posts.slice(0, 2)

  return (
    <section id="blog" className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-16">
          <span className="text-xs font-medium tracking-widest text-white/60 uppercase">
            {blogsData.badge}
          </span>

          <h2 className="max-w-2xl text-4xl leading-tight font-light tracking-tight text-white sm:text-5xl md:text-6xl">
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
              </div>

              <div className="relative z-10 -mt-20 ml-auto w-4/5 rounded-2xl bg-brand-dark p-6 sm:-mt-24 sm:w-3/4 sm:p-8">
                <p className="text-xs text-white/50">
                  <span>{post.category}</span>
                  <span className="mx-2">—</span>
                  <span>{formatDate(post.date)}</span>
                </p>

                <h3 className="mt-4 text-xl font-medium text-white sm:text-2xl">
                  {post.title}
                </h3>

                <div className="mt-6 border-t border-white/10 pt-4">
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
          ))}
        </div>
      </div>
    </section>
  )
}
