import { ProjectInfo } from "@/components/projects/ProjectInfo"
import { ProjectMedia } from "@/components/projects/ProjectMedia"
import type { ProjectStackItem } from "@/lib/projects"
import Link from "next/link"

interface ProjectCardProps {
  item: ProjectStackItem
  priority?: boolean
}

/**
 * A large, Cuberto-style case card. Two independent destinations, never
 * nested: the media itself goes to the live project URL (an arrow on the
 * signal cursor disc while hovering it and played as a gallery reel),
 * and "View Case Study" in the info row (ProjectInfo.tsx) goes to the
 * internal case-study page.
 */
export function ProjectCard({ item, priority }: ProjectCardProps) {
  const exploreHref = item.liveUrl ?? `/projects/${item.slug}`

  return (
    <article data-project-card className="flex flex-col gap-5 will-change-transform">
      <Link
        href={exploreHref}
        target={item.liveUrl ? "_blank" : undefined}
        rel={item.liveUrl ? "noopener noreferrer" : undefined}
        data-cursor="view"
        aria-label={`Explore ${item.label} — view project`}
        data-media-host
        className="group/media relative block aspect-4/3 overflow-hidden rounded-2xl bg-paper-2"
      >
        <ProjectMedia
          image={item.thumbnail}
          gallery={item.gallery}
          alt={item.label}
          priority={priority}
          sizes="(min-width: 640px) 50vw, 100vw"
        />
      </Link>

      <ProjectInfo label={item.label} slug={item.slug} />
    </article>
  )
}
