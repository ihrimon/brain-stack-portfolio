import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  imgSize?: number
  /** Which mark to show — pick the one legible against the background this
   * instance actually renders on ("on-dark" for a dark surface, "on-light"
   * for a light one). There's no automatic/theme-driven variant: this
   * codebase has no theme switcher, so every usage renders against one
   * known, fixed background and should say so explicitly. */
  variant?: "on-dark" | "on-light"
  /** Pass `false` to render as a plain mark instead of a link to "/". */
  href?: string | false
}

export function Logo({
  className,
  imgSize = 18,
  variant = "on-light",
  href = "/",
}: LogoProps) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center font-heading text-xl font-bold tracking-tight text-heading uppercase",
        className
      )}
    >
      BR
      <Image
        src={variant === "on-dark" ? "/logo-white.png" : "/logo-dark.png"}
        alt=""
        width={imgSize}
        height={imgSize}
        className="mx-0.5 inline-block object-contain"
      />
      IN STACK
    </span>
  )

  if (href === false) return mark

  return (
    <Link href={href} aria-label="Brain Stack - Return to homepage">
      {mark}
    </Link>
  )
}
