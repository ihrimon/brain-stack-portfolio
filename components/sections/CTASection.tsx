import { DiagonalPattern } from "@/components/animations/DiagonalPattern"
import { ctaData } from "@/lib/data/cta"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="bg-brand-dark px-5 py-16 sm:px-8 sm:py-20">
      <div className="relative mx-auto flex max-w-400 flex-col items-center overflow-hidden rounded-3xl bg-neutral-900 px-8 py-20 text-center sm:py-28">
        <DiagonalPattern className="opacity-60 [mask-image:linear-gradient(to_left,black,transparent_65%)]" />

        <h2 className="relative max-w-3xl text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
          {ctaData.heading}
        </h2>

        <Link
          href="/contact"
          data-cursor="magnetic"
          className="group relative mt-6 inline-flex items-center gap-2 text-sm font-bold tracking-widest text-white uppercase"
        >
          <span className="border-b border-white pb-0.5 transition-colors duration-300 group-hover:border-white/50 group-hover:text-white/80">
            Let&apos;s Get in Touch
          </span>
          <ArrowUpRight className="size-4 text-brand-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </div>
    </section>
  )
}
