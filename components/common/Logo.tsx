import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  imgSize?: number
  /** Pass `false` to render as a plain mark instead of a link to "/". */
  href?: string | false
}

export function Logo({ className, imgSize = 18, href = "/" }: LogoProps) {
  // Both marks are rendered and CSS picks the one legible on the current
  // theme (including forced-dark `data-theme` islands) — choosing in JS
  // would mismatch the server markup for returning light-mode visitors.
  // Each carries alt="A" — the brain icon stands in for the A in "BRAIN" —
  // and the hidden one is display:none, so it never doubles up.
  const mark = (
    <span
      className={cn(
        "inline-flex items-center font-heading text-xl font-bold tracking-tight text-heading uppercase",
        className
      )}
    >
      BR
      <Image
        src="/logo-white.png"
        alt="A"
        width={imgSize}
        height={imgSize}
        className="mx-0.5 inline-block object-contain light:hidden"
      />
      <Image
        src="/logo-dark.png"
        alt="A"
        width={imgSize}
        height={imgSize}
        className="mx-0.5 hidden object-contain light:inline-block"
      />
      IN STACK
    </span>
  )

  if (href === false) return mark

  return (
    // No aria-label: the mark itself reads "BRAIN STACK" (the brain icon is
    // the "A"), so the link's accessible name matches its visible label.
    <Link href={href}>
      {mark}
    </Link>
  )
}
