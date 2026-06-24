"use client"

import { portfolioData } from '@/data/portfolio-data'
import { motion } from "framer-motion"

export default function HeroSection() {
  const { hero } = portfolioData

  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
      <div className="space-y-8 text-center">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            {hero.headline}
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-foreground/60 md:text-2xl">
            {hero.subheadline}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-4 pt-8 sm:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            className="rounded-lg bg-primary px-8 py-4 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hero.cta}
          </motion.button>
          <motion.button
            className="rounded-lg border-2 border-primary px-8 py-4 font-semibold text-primary transition-all hover:bg-primary/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {hero.secondaryCta}
          </motion.button>
        </motion.div>

        <motion.div
          className="border-t border-border pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="mb-8 text-sm text-foreground/50">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {portfolioData.companies.map((company, idx) => (
              <motion.div
                key={idx}
                className={`${company.color} rounded-lg px-6 py-3 text-sm font-medium text-foreground`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.08 }}
                whileHover={{ scale: 1.05 }}
              >
                {company.name}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
