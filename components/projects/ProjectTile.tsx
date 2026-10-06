import { ProjectMedia } from "@/components/projects/ProjectMedia"
import type { Project } from "@/lib/data/projects"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface ProjectTileProps {
  project: Project
  priority?: boolean
  className?: string
  style?: React.CSSProperties
  /** Heading level for the title — `h2` where the tile sits directly under
   * the page's h1 (projects page), `h3` under a section heading. */
  headingLevel?: "h2" | "h3"
}

/**
 * Projects-page / "More Projects" card: the media links to the internal
 * case-study page (cursor pill: "View Full Project") and plays the gallery
 * reel on hover; the live site, when there is one, gets its own small
 * corner link so the two destinations are never nested.
 */
export function ProjectTile({
  project,
  priority,
  className,
  style,
  headingLevel: Heading = "h3",
}: ProjectTileProps) {
  return (
    <article className={className} style={style}>
      <div className="relative">
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="view"
          data-cursor-text="View Full Project"
          aria-label={project.title}
          data-media-host
          className="group/media relative block aspect-4/3 overflow-hidden rounded-2xl bg-paper-2"
        >
          <ProjectMedia
            image={project.heroImage}
            gallery={project.gallery}
            alt={project.title}
            priority={priority}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
        </Link>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${project.title} live site`}
            title="Visit live site"
            data-cursor="magnetic"
            className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-static-black/40 text-static-white backdrop-blur-md transition-colors duration-300 hover:bg-signal hover:text-signal-ink"
          >
            <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
          {project.category}
        </p>
        <Heading className="mt-2 text-xl leading-snug font-medium tracking-tight text-ink sm:text-2xl">
          <Link href={`/projects/${project.slug}`} className="transition-colors duration-300 hover:text-signal-text">
            {project.title}
          </Link>
        </Heading>

        {project.technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink-2"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
