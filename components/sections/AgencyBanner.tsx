import { DiagonalPattern } from "@/components/animations/DiagonalPattern"
import { ParallaxImage } from "@/components/animations/ParallaxImage"
import type { AgencyBannerData } from "@/lib/data/service-page"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Link from "next/link"

interface AgencyBannerProps {
  banner: AgencyBannerData
}

export default function AgencyBanner({ banner }: AgencyBannerProps) {
  return (
    <section className="overflow-hidden bg-brand-dark py-20 sm:py-28">
      <div className="grid lg:grid-cols-2">
        <ParallaxImage
          src={banner.image}
          alt={banner.title}
          sizes="(min-width: 1024px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          wrapperClassName="aspect-4/3 w-full max-w-full bg-neutral-900 lg:aspect-auto lg:min-h-140"
        />

        <div className="relative flex flex-col justify-between gap-16 overflow-hidden bg-neutral-900 px-8 py-16 sm:px-12 lg:px-16 lg:py-20">
          <DiagonalPattern />

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
              href={banner.button.href}
              data-cursor="magnetic"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-wide text-black uppercase transition-colors duration-300 hover:bg-white/90"
            >
              {banner.button.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
