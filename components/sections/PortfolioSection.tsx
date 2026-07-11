"use client"

import { SectionBadge } from "@/components/common/SectionBadge"
import { Marquee } from "@/components/shared/marquee"
import { portfolioData } from "@/data/portfolio"
import "@/lib/GSAPAnimations"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

type Project = (typeof portfolioData.projects)[number]

function PortfolioCard({ project, wide }: { project: Project; wide: boolean }) {
  return (
    <Link
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/card relative block h-80 shrink-0 overflow-hidden rounded-xl sm:h-96",
        wide ? "w-64 sm:w-120" : "w-56 sm:w-120"
      )}
      data-cursor="magnetic"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        quality={100}
        className="object-cover transition-transform duration-500 group-hover/card:scale-105"
        sizes="(min-width: 640px) 480px, 256px"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 flex translate-y-4 flex-wrap items-center justify-between gap-4 p-6 opacity-0 transition-all duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        <div>
          <h3 className="text-lg font-medium text-white">{project.title}</h3>
          <p className="text-sm text-white/60">{project.category}</p>
        </div>

        <span className="flex shrink-0 scale-90 items-center gap-3 rounded-full bg-white p-1.5 pl-6 text-sm font-semibold text-black shadow-2xl transition-transform duration-300 group-hover/card:scale-100">
          View Work
          <span className="flex size-9 items-center justify-center rounded-full bg-black text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      </div>
    </Link>
  )
}

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { projects } = portfolioData
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
        <SectionBadge>{portfolioData.badge}</SectionBadge>

        <h2
          ref={titleRef}
          className="mt-8 max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl"
        >
          {portfolioData.title}
        </h2>
      </div>

      <div className="mt-16 space-y-6">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:1.5rem]">
          {rowOne.map((project, index) => (
            <PortfolioCard
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
            <PortfolioCard
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
