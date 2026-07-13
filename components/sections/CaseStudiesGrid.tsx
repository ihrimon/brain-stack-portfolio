"use client"

import { DiagonalPattern } from "@/components/animations/DiagonalPattern"
import { CircleViewButton } from "@/components/buttons/CircleViewButton"
import { SectionBadge } from "@/components/common/SectionBadge"
import { caseStudiesData, type CaseStudy } from "@/lib/data/caseStudies"
import { caseStudiesPageData } from "@/lib/data/caseStudiesPage"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Column position drives the fade-in origin: left column enters from the
// left, middle column rises from the bottom, right column enters from the
// right — mirrors the card's position in the 3-column grid.
const columnVariants: Variants[] = [
  { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
]

function CaseStudyCard({ caseStudy, index }: { caseStudy: CaseStudy; index: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={columnVariants[index % 3]}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}`}
        className="group/card block h-full overflow-hidden bg-neutral-900 transition-transform duration-300 hover:-translate-y-1"
        data-cursor="magnetic"
      >
        <div className="relative pb-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-4 bottom-0 -z-10 overflow-hidden bg-neutral-900"
          >
            <DiagonalPattern className="opacity-60" />
          </div>

          <div className="relative aspect-4/3 overflow-hidden">
            <Image
              src={caseStudy.thumbnail}
              alt={caseStudy.title}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />

            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100" />

            <CircleViewButton />

            <span className="absolute top-4 left-4 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[11px] font-medium tracking-widest text-white uppercase backdrop-blur-sm">
              {caseStudy.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <span className="text-xs font-medium tracking-widest text-white/40 uppercase">
            {caseStudy.category}
          </span>

          <h3 className="mt-2 text-2xl font-medium text-white transition-all duration-300 hover:underline">
            {caseStudy.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
            {caseStudy.overview}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {caseStudy.technologies.slice(0, 4).map((tech) => (
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

export default function CaseStudiesGrid() {
  return (
    <section
      id="case-studies-grid"
      className="overflow-hidden bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <SectionBadge>{caseStudiesPageData.badge}</SectionBadge>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-8">
          <h1 className="max-w-3xl text-3xl leading-tight font-medium tracking-tight text-white uppercase sm:text-4xl md:text-5xl">
            {caseStudiesPageData.title}
          </h1>

          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2">
            <span className="text-lg font-semibold text-white">
              {caseStudiesPageData.stat.value}
            </span>
            <span className="text-xs tracking-widest text-white/50 uppercase">
              {caseStudiesPageData.stat.label}
            </span>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
          {caseStudiesPageData.description}
        </p>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudiesData.map((caseStudy, index) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
