import { ParallaxImage } from "@/components/animations/ParallaxImage"
import { servicesPageData } from "@/lib/data/servicesPage"
import Link from "next/link"

const { banner } = servicesPageData

export default function AgencyBanner() {
  return (
    <section className="overflow-hidden bg-brand-dark py-20 sm:py-28">
      <div className="grid lg:grid-cols-2">
        <ParallaxImage
          src={banner.image}
          alt={banner.title}
          sizes="(min-width: 1024px) 50vw, 100vw"
          wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900 lg:aspect-auto lg:min-h-140"
        />

        <div className="relative flex flex-col justify-between gap-16 overflow-hidden bg-neutral-900 px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 14px)",
            }}
          />

          <h2 className="relative max-w-md text-4xl leading-tight font-medium tracking-tight text-white sm:text-5xl">
            {banner.title}
          </h2>

          <div className="relative max-w-md">
            <p className="text-base leading-relaxed text-white/50 sm:text-lg">
              {banner.descriptionBefore}
              <span className="font-semibold text-white">
                {banner.highlight}
              </span>
              {banner.descriptionAfter}
            </p>

            <Link
              href={banner.cta.href}
              data-cursor="magnetic"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition-colors duration-300 hover:bg-white/90"
            >
              {banner.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
