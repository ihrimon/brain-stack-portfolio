import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { ProjectMedia } from "@/components/projects/ProjectMedia"
import type { ProjectStackItem } from "@/lib/projects"
import Link from "next/link"

interface ProjectCardProps {
  item: ProjectStackItem
  priority?: boolean
}

/**
 * A single stacked-gallery card. The root is a plain div, not a link — it
 * exposes two independent destinations instead of one whole-card link:
 * "Explore Project", centered over the image and visible only while
 * hovering that image specifically (scoped to its own `group/media`, not
 * the card-wide `group`), goes straight to the live project URL; "View Case
 * Study" in the info bar (ProjectInfo.tsx) goes to the internal case-study
 * page. Nesting either inside a card-wide `<a>` would be invalid HTML,
 * hence the split.
 */
export function ProjectCard({ item, priority }: ProjectCardProps) {
  const exploreHref = item.liveUrl ?? `/projects/${item.slug}`

  return (
    <div
      data-project-card
      className="group relative flex aspect-3.5/4 w-full flex-col overflow-hidden rounded-lg bg-surface-dark shadow-2xl sm:aspect-4/3.5 sm:bg-card/55 sm:backdrop-blur-lg"
    >
      {/* `group/media`: scopes "Explore Project" to hovering the image
          itself — separate from the card-wide `group` above. */}
      <div className="group/media absolute inset-0 overflow-hidden sm:relative sm:flex-1">
        <div className="absolute -inset-2">
          <ProjectMedia image={item.thumbnail} alt={item.label} priority={priority} />
        </div>

        <Link
          href={exploreHref}
          target={item.liveUrl ? "_blank" : undefined}
          rel={item.liveUrl ? "noopener noreferrer" : undefined}
          data-cursor="magnetic"
          aria-label={`Explore ${item.label} — view project`}
          className="absolute inset-0 z-30 m-auto flex size-20 items-center justify-center rounded-full bg-white text-sm font-semibold text-black opacity-0 backdrop-blur-md group-hover/media:opacity-100"
        >
          Explore
        </Link>
      </div>

      <ProjectInfo
        label={item.label}
        year={item.year}
        category={item.category}
        slug={item.slug}
      />
    </div>
  )
}
