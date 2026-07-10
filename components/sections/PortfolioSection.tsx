import { Marquee } from "@/components/shared/marquee"
import { portfolioData } from "@/data/portfolio"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Project = (typeof portfolioData.projects)[number]

function PortfolioCard({ project, wide }: { project: Project; wide: boolean }) {
  return (
    <Link
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block h-80 shrink-0 overflow-hidden rounded-xl sm:h-96",
        wide ? "w-64 sm:w-120" : "w-56 sm:w-120"
      )}
      data-cursor="magnetic"
    >
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(min-width: 640px) 24rem, 16rem"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <span className="flex scale-90 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-xl transition-transform duration-300 group-hover:scale-100">
          View Work
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="text-lg font-medium text-white">{project.title}</h3>
        <p className="text-sm text-white/60">{project.category}</p>
      </div>
    </Link>
  )
}

export default function PortfolioSection() {
  const { projects } = portfolioData
  const midpoint = Math.ceil(projects.length / 2)
  const rowOne = projects.slice(0, midpoint)
  const rowTwo = projects.slice(midpoint)

  return (
    <section id="projects" className="overflow-hidden bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/60 uppercase">
            <span className="size-1.5 rounded-full bg-white" />
            {portfolioData.badge}
          </div>
          <span className="text-sm font-medium text-white/60">
            ({String(projects.length).padStart(2, "0")})
          </span>
        </div>

        <h2 className="mt-10 max-w-3xl text-3xl leading-tight font-light tracking-tight text-white uppercase sm:text-4xl md:text-5xl">
          {portfolioData.title}
        </h2>
      </div>

      <div className="mt-16 space-y-6">
        <Marquee pauseOnHover className="[--duration:38s] [--gap:1.5rem]">
          {rowOne.map((project, index) => (
            <PortfolioCard key={project.id} project={project} wide={index % 2 === 0} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="[--duration:38s] [--gap:1.5rem]">
          {rowTwo.map((project, index) => (
            <PortfolioCard key={project.id} project={project} wide={index % 2 === 1} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
