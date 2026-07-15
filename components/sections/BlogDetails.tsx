import { SectionBadge } from "@/components/common/SectionBadge"
import { blogsData, type BlogContentBlock } from "@/lib/data/blog-page"
import { getReadingTime } from "@/lib/utils/reading-time"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Post = (typeof blogsData.posts)[number]

interface BlogDetailsProps {
  post: Post
}

function ContentBlock({ block }: { block: BlogContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-base leading-relaxed text-white/60 sm:text-lg">
          {block.text}
        </p>
      )

    case "heading":
      return (
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          {block.text}
        </h2>
      )

    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-base text-white/60 sm:text-lg"
            >
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-white/40" />
              {item}
            </li>
          ))}
        </ul>
      )

    case "image":
      return (
        <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl bg-neutral-900">
          <Image
            src={block.src}
            alt={block.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
        </div>
      )

    case "imageGrid":
      return (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {block.images.map((image) => (
            <div
              key={image.src + image.alt}
              className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-900"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 450px, 50vw"
              />
            </div>
          ))}
        </div>
      )

    case "sideBySide":
      return (
        <div className="grid gap-6 sm:grid-cols-2 sm:items-center sm:gap-10">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-neutral-900">
            <Image
              src={block.image.src}
              alt={block.image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 450px, 100vw"
            />
          </div>

          <p className="text-base leading-relaxed text-white/60 sm:text-lg">
            {block.text}
          </p>
        </div>
      )

    default:
      return null
  }
}

export default function BlogDetails({ post }: BlogDetailsProps) {
  const relatedPosts = blogsData.posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3)

  const year = new Date(post.publishDate).getFullYear()
  const readingTime = getReadingTime(post.content)

  return (
    <>
      <section className="bg-brand-dark pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <h1 className="max-w-5xl text-4xl leading-[1.05] font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            {post.title}
          </h1>

          <p className="mt-8 text-sm text-white/40">
            By{" "}
            <span className="font-semibold text-white/70">{post.author}</span> —{" "}
            {post.category} — {year} — {readingTime} min read
          </p>
        </div>
      </section>

      <section className="bg-brand-dark pb-16 sm:pb-20">
        <div className="relative aspect-21/9 w-full bg-neutral-900">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="bg-brand-dark pb-20 sm:pb-28">
        <div className="mx-auto max-w-400 px-5 sm:px-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {post.content.map((block, index) => (
              <ContentBlock key={index} block={block} />
            ))}

            <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
              <span className="text-sm font-semibold text-white">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-white/70 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="bg-brand-dark pb-20 sm:pb-28">
          <div className="mx-auto max-w-400 px-5 sm:px-8">
            <SectionBadge variant="label" dot>
              Related Posts
            </SectionBadge>

            <h2 className="mt-8 max-w-3xl text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
              Learn more related journals
            </h2>

            <div className="mt-16 grid gap-8 divide-white/10 sm:grid-cols-3 sm:gap-10 sm:divide-x">
              {relatedPosts.map((related) => (
                <article
                  key={related.slug}
                  className="group flex flex-col sm:px-8 sm:first:pl-0 sm:last:pr-0"
                >
                  <Link
                    href={`/blog/${related.slug}`}
                    className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-neutral-900"
                    data-cursor="magnetic"
                  >
                    <Image
                      src={related.featuredImage}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                    />
                  </Link>

                  <h3 className="mt-6 text-xl leading-snug font-semibold text-white sm:text-2xl">
                    <Link
                      href={`/blog/${related.slug}`}
                      className="transition-colors duration-300 hover:text-white/80"
                      data-cursor="magnetic"
                    >
                      {related.title}{" "}
                      <span className="ml-1 inline-flex size-6 -translate-y-0.5 items-center justify-center rounded-full border border-white/30 align-middle">
                        <ArrowUpRight className="size-3.5" />
                      </span>
                    </Link>
                  </h3>

                  <p className="mt-4 text-sm text-white/40">
                    By{" "}
                    <span className="font-semibold text-white/70">
                      {related.author}
                    </span>{" "}
                    — {new Date(related.publishDate).getFullYear()}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
