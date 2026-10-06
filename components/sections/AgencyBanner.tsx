import { ParallaxImage } from "@/components/animations/ParallaxImage"
import type { AgencyBannerData } from "@/lib/data/service-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface AgencyBannerProps {
  banner: AgencyBannerData
}

export default function AgencyBanner({ banner }: AgencyBannerProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-site gap-4 px-4 lg:px-6 lg:grid-cols-2 lg:gap-6">
        <ParallaxImage
          src={banner.image}
          alt={banner.title}
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          wrapperClassName="aspect-4/3 w-full overflow-hidden rounded-3xl bg-paper-2 lg:aspect-auto lg:min-h-140"
        />

        <div className="relative flex flex-col justify-between gap-16 overflow-hidden rounded-3xl border border-line bg-paper-2 px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-signal/15 blur-3xl"
          />

          <h2 className="relative max-w-md heading-section text-ink">
            {banner.title}
          </h2>

          <div className="relative max-w-md">
            <p className="text-base leading-relaxed text-ink-2 sm:text-lg">
              {banner.descriptionBefore}
              <span className="font-medium text-ink">{banner.highlight}</span>
              {banner.descriptionAfter}
            </p>

            <Link
              href={banner.button.href}
              data-cursor="magnetic"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold tracking-wide text-paper uppercase transition-colors duration-300 hover:bg-signal hover:text-signal-ink"
            >
              {banner.button.label}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
