import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  imgSize?: number
  /**
   * "auto" swaps images with the `.dark` class via CSS (no client JS/hydration
   * flicker). Use "on-dark" / "on-light" to pin the mark to a fixed
   * background regardless of theme (e.g. a footer that's always dark).
   */
  variant?: "auto" | "on-dark" | "on-light"
  /** Pass `false` to render as a plain mark instead of a link to "/". */
  href?: string | false
}

export function Logo({
  className,
  imgSize = 18,
  variant = "auto",
  href = "/",
}: LogoProps) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center text-xl font-bold tracking-tight text-heading uppercase font-heading",
        className
      )}
    >
      BR
      {variant === "auto" ? (
        <>
          <Image
            src="/logo-dark.png"
            alt="a"
            width={imgSize}
            height={imgSize}
            className="mx-0.5 inline-block object-contain dark:hidden"
          />
          <Image
            src="/logo-white.png"
            alt="a"
            width={imgSize}
            height={imgSize}
            className="mx-0.5 hidden object-contain dark:inline-block"
          />
        </>
      ) : (
        <Image
          src={variant === "on-dark" ? "/logo-white.png" : "/logo-dark.png"}
          alt="a"
          width={imgSize}
          height={imgSize}
          className="mx-0.5 inline-block object-contain"
        />
      )}
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
