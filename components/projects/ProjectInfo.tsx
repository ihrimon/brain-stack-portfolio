import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"

interface ProjectInfoProps {
  title: string
  year: string | null
  category: string
  techPills: string[]
  slug: string
  className?: string
}

/** Dumb bottom info bar for a stacked project card — title, year, category
 * pill, tech pills, and a "View Case Study" link to the internal
 * case-study page. Distinct from "Explore Project" in ProjectCard.tsx,
 * which only appears on hovering the image and goes to the live project
 * URL — this one lives here, in the content area, and is its own
 * destination. Hover animation on the tech pills rides the ancestor
 * `.group` on ProjectCard's root, not local state. */
export function ProjectInfo({
  title,
  year,
  category,
  techPills,
  slug,
  className,
}: ProjectInfoProps) {
  return (
    <div className={cn("relative z-10 flex flex-col gap-4 p-6 sm:p-8", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white sm:text-sm">
          {category}
        </span>
        {year && (
          <span className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/60 sm:text-sm">
            {year}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-2xl font-medium text-white/85 transition-colors duration-500 group-hover:text-white sm:text-3xl">
            {title}
          </h3>

          {techPills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {techPills.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        <Link
          href={`/projects/${slug}`}
          data-cursor="magnetic"
          className="group/cta relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pr-1.5 pl-5 text-xs font-medium whitespace-nowrap text-white backdrop-blur-sm transition-colors duration-300 hover:border-white/30 sm:text-sm"
        >
          View Case Study
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover/cta:translate-x-0.5">
            <Image src="/icons/arrow-right.svg" alt="" width={12} height={12} />
          </span>
        </Link>
      </div>
    </div>
  )
}
