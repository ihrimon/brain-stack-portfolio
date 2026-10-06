import { cn } from "@/lib/utils/cn"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface ProjectInfoProps {
  label: string
  slug: string
  className?: string
}

/** Drops the trailing domain from a "Name · Type · domain.com" label —
 * the card's media already links to the live site. */
function displayTitle(label: string) {
  return label
    .split(" · ")
    .filter((part) => !/^[\w-]+(\.[\w-]+)+$/.test(part.trim()))
    .join(" · ")
}

/** Info row under a project card — title and a "View Case Study" link to
 * the internal case-study page. Distinct from the card's media link
 * (ProjectCard.tsx), which goes to the live project URL. */
export function ProjectInfo({ label, slug, className }: ProjectInfoProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8",
        className
      )}
    >
      <h3 className="min-w-0 line-clamp-2 text-lg leading-snug font-medium tracking-tight text-ink sm:text-xl">
        {displayTitle(label)}
      </h3>

      <Link
        href={`/projects/${slug}`}
        className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium whitespace-nowrap text-ink"
      >
        <span className="relative">
          View Case Study
          <span className="absolute inset-x-0 -bottom-1 h-px bg-ink/30 transition-colors duration-500 ease-premium group-hover:bg-signal" />
        </span>
        <ArrowUpRight className="size-4 transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal" />
      </Link>
    </div>
  )
}
