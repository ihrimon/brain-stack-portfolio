"use client"

import { CircleViewButton } from "@/components/buttons/CircleViewButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import { Marquee } from "@/components/shared/marquee"
import "@/lib/animations/gsap-animations"
import { projectsData, type Project } from "@/lib/data/projects-page"
// Page-chrome text (badge/title) is static; only the project list itself is Sheet-driven.
import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

function ProjectMarqueeCard({ project, wide }: { project: Project; wide: boolean }) {
  const liveUrl = project.liveUrl

  return (
    <div
      className={cn(
        "group/card relative h-80 shrink-0 overflow-hidden rounded-2xl sm:h-96",
        wide ? "w-64 sm:w-130" : "w-56 sm:w-130"
      )}
    >
      <Link
        href={liveUrl ?? `/projects/${project.slug}`}
        target={liveUrl ? "_blank" : undefined}
        rel={liveUrl ? "noopener noreferrer" : undefined}
        className="absolute inset-0 block"
        data-cursor="magnetic"
        aria-label={liveUrl ? `Visit ${project.title} live site` : `View ${project.title}`}
      >
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          quality={100}
          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          sizes="(min-width: 640px) 480px, 256px"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />
      </Link>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-between gap-3 p-6 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        <div className="min-w-0">
          <p className="text-sm text-white/60">{project.category}</p>
          <h3 className="truncate text-2xl font-medium text-white">
            {project.title}
          </h3>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          data-cursor="magnetic"
          className="pointer-events-auto shrink-0 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs font-medium whitespace-nowrap text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-black"
        >
          View Case Study
        </Link>
      </div>

      <CircleViewButton />
    </div>
  )
}

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const midpoint = Math.ceil(projects.length / 2)
  const rowOne = projects.slice(0, midpoint)
  const rowTwo = projects.slice(midpoint)

  useGSAP(
    () => {
      gsap.effects.textRevealOnScroll(titleRef.current)
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="overflow-hidden bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <SectionBadge>{projectsData.badge}</SectionBadge>

        <h2
          ref={titleRef}
          className="mt-8 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          {projectsData.title}
        </h2>
      </div>

      <div className="mt-16 space-y-6">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:1.5rem]">
          {rowOne.map((project, index) => (
            <ProjectMarqueeCard
              key={project.id}
              project={project}
              wide={index % 2 === 0}
            />
          ))}
        </Marquee>

        <Marquee
          reverse
          pauseOnHover
          className="[--duration:38s] [--gap:1.5rem]"
        >
          {rowTwo.map((project, index) => (
            <ProjectMarqueeCard
              key={project.id}
              project={project}
              wide={index % 2 === 1}
            />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
