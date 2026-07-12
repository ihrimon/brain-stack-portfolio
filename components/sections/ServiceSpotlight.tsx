"use client"

import { servicesPageData } from "@/lib/data/servicesPage"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const { spotlight } = servicesPageData

export default function ServiceSpotlight() {
  const [index, setIndex] = useState(0)
  const current = spotlight[index]

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % spotlight.length)
  }

  return (
    <section className="bg-brand-dark pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <h1 className="max-w-5xl text-4xl leading-[0.95] font-medium tracking-tight text-white uppercase sm:text-6xl md:text-[84px]">
          {current.title}
        </h1>
        <div className="mt-16 border-t border-white/10 sm:mt-20" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="grid gap-10 pt-16 lg:grid-cols-[1fr_1px_1fr] lg:gap-16"
          >
            <div className="flex flex-col justify-center">
              <h2 className="max-w-md text-3xl leading-tight font-medium text-white sm:text-4xl">
                {current.heading}
              </h2>

              <p className="mt-8 max-w-md text-base leading-relaxed text-white/60">
                {current.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-5 py-2 text-sm text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className="hidden bg-white/10 lg:block" />

            <div className="relative aspect-4/3 overflow-hidden bg-neutral-900">
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
