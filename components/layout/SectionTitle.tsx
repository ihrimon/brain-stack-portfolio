"use client"

import { motion } from "framer-motion"

interface SectionTitleProps {
  badge?: string
  title: string
  subtitle?: string
  center?: boolean
}

export default function SectionTitle({
  badge,
  title,
  subtitle,
  center = false,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={center ? "text-center" : ""}
    >
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          {badge}
        </span>
      )}

      <h2 className="text-3xl md:text-5xl">{title}</h2>

      {subtitle && (
        <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  )
}
