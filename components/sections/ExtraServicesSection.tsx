import { servicesData } from "@/lib/data/services"
import {
  ArrowUpRight,
  Cloud,
  Rocket,
  Smartphone,
  Sparkles,
  Watch,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"

const icons: Record<string, LucideIcon> = {
  "01": Smartphone,
  "02": Cloud,
  "03": Sparkles,
  "04": Watch,
  "05": Rocket,
}

export default function ExtraServicesSection() {
  return (
    <section id="services" className="bg-brand-dark py-20 sm:py-28">
      <div className="mx-auto max-w-400 px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="flex flex-col justify-between lg:pb-2">
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-white/60 uppercase">
              <span className="size-1.5 rounded-full bg-white" />
              {servicesData.badge}
            </div>

            <div className="mt-16 lg:mt-0">
              <p className="text-6xl font-medium text-white sm:text-7xl">
                {servicesData.stat.value}
              </p>
              <p className="mt-2 text-sm text-white/50 sm:text-base">
                {servicesData.stat.label}
              </p>
            </div>
          </div>

          <div>
            <h2 className="max-w-3xl text-3xl leading-tight font-light tracking-tight text-white uppercase sm:text-4xl md:text-5xl">
              {servicesData.title}
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {servicesData.items.map((item) => {
                const Icon = icons[item.id] ?? Sparkles

                return (
                  <Link
                    key={item.id}
                    href={item.cta.href}
                    className="group relative flex min-h-72 flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-8 transition-colors hover:border-white/30"
                    data-cursor="magnetic"
                  >
                    <Icon
                      className="size-8 text-white/70 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.25}
                    />

                    <div className="relative z-10">
                      <h3 className="text-xl font-medium text-white sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/50">
                        {item.eyebrow.join(" · ")}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-6 text-[8rem] leading-none font-bold text-white/5"
                    >
                      {item.id}
                    </span>

                    <ArrowUpRight className="absolute top-8 right-8 size-5 text-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
