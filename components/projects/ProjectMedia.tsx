import { cn } from "@/lib/utils/cn"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"

interface ProjectMediaProps {
  image: string
  video?: string
  lottie?: string
  alt: string
  priority?: boolean
  className?: string
}

/**
 * Dumb media renderer: the image is always the base/fallback layer, a
 * looping muted `<video>` (when provided) plays on top. `lottie` is
 * accepted and wired through end to end but stubbed: no project in the
 * current data set ships a Lottie file, and no Lottie dependency is
 * installed, so this only reserves the prop/branch for whenever a real
 * asset shows up.
 */
export function ProjectMedia({
  image,
  video,
  lottie,
  alt,
  priority,
  className,
}: ProjectMediaProps) {
  return (
    <div className={cn("relative size-full overflow-hidden", className)}>
      <Image
        src={image}
        alt={alt}
        fill
        quality={100}
        priority={priority}
        // See ProjectsGridSection.tsx for why `fetchPriority` is set
        // alongside `priority` explicitly on this Next.js version.
        fetchPriority={priority ? "high" : undefined}
        sizes="(min-width: 1024px) 640px, (min-width: 640px) 90vw, 100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={cn(
          "object-cover transition-transform duration-500 ease-out group-hover/media:scale-105",
          video && "opacity-0"
        )}
      />

      {video && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 size-full object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}

      {lottie && (
        <div aria-hidden="true" data-lottie-src={lottie} className="absolute inset-0" />
      )}
    </div>
  )
}
