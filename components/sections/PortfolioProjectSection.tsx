"use client"

import { CircleViewButton } from "@/components/buttons/CircleViewButton"
import { portfolioData } from "@/data/portfolio"
import { cn } from "@/lib/utils"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

const PAGE_SIZE = 9

type Project = (typeof portfolioData.projects)[number]

// Column position drives the fade-in origin: left column enters from the
// left, middle column rises from the bottom, right column enters from the
// right — mirrors the card's position in the 3-column grid.
const columnVariants: Variants[] = [
  { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={columnVariants[index % 3]}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className="group/card block h-full overflow-hidden  bg-neutral-900 transition-transform duration-300 hover:-translate-y-1"
        data-cursor="magnetic"
      >
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

          <CircleViewButton />
        </div>

        <div className="p-6">
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {project.category}
          </span>

          <h3 className="mt-2 text-2xl font-medium text-white hover:underline transition-all duration-300">
            {project.title}
          </h3>

          {/* <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
            {project.description}
          </p> */}

          <div className="mt-4 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function PortfolioProjectSection() {
  const { projects } = portfolioData

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((project) => project.category))),
    ],
    [projects]
  )

  const [activeTab, setActiveTab] = useState("All")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filteredProjects = useMemo(
    () =>
      activeTab === "All"
        ? projects
        : projects.filter((project) => project.category === activeTab),
    [projects, activeTab]
  )

  const visibleProjects = filteredProjects.slice(0, visibleCount)
  const hasMore = filteredProjects.length > visibleCount

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section
      id="portfolio-projects"
      className="overflow-hidden bg-brand-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="mt-12 max-w-4xl">
            <h2 className="text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-[84px] cursor-default">
              {portfolioData.title}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 sm:max-w-md sm:justify-end lg:max-w-xl">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleTabChange(category)}
                data-cursor="magnetic"
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-300 sm:text-sm",
                  activeTab === category
                    ? "border-white bg-white text-black"
                    : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              data-cursor="magnetic"
              className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/5 cursor-pointer"
            >
              See More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
