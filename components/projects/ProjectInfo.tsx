import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"

interface ProjectInfoProps {
  title: string
  year: string | null
  category: string
  slug: string
  className?: string
}

/** Dumb bottom info bar for a stacked project card — title, year, category
 * pill, and a "View Case Study" link to the internal case-study page.
 * Distinct from "Explore Project" in ProjectCard.tsx, which only appears on
 * hovering the image and goes to the live project URL — this one lives
 * here, in the content area, and is its own destination. */
export function ProjectInfo({
  title,
  year,
  category,
  slug,
  className,
}: ProjectInfoProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-4 sm:relative sm:gap-4 sm:p-6 lg:p-8",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium text-white sm:block sm:px-4 sm:py-1.5 sm:text-xs lg:text-sm">
          {category}
        </span>
        {year && (
          <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] font-medium text-white/60 sm:px-4 sm:py-1.5 sm:text-xs lg:text-sm">
            {year}
          </span>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-white/85 transition-colors duration-500 group-hover:text-white sm:text-2xl lg:text-3xl">
            {title}
          </h3>
        </div>

        <Link
          href={`/projects/${slug}`}
          data-cursor="magnetic"
          className="group/cta relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-1 pr-1 pl-3 text-[11px] font-medium whitespace-nowrap text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/30 sm:gap-2 sm:py-1.5 sm:pr-1.5 sm:pl-5 sm:text-xs lg:text-sm"
        >
          View Case Study
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover/cta:translate-x-0.5 sm:size-7">
            <Image src="/icons/arrow-right.svg" alt="" width={10} height={10} className="sm:w-3 sm:h-3" />
          </span>
        </Link>
      </div>
    </div>
  )
}
