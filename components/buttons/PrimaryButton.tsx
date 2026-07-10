"use client"

import { MagneticButton } from "@/components/animations/MagneticButton"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import Image from "next/image"
import Link from "next/link"
import { useRef, type ComponentPropsWithoutRef } from "react"

interface PrimaryButtonProps extends ComponentPropsWithoutRef<"button"> {
  href?: string
  showArrow?: boolean
}

const GAP = 16

export function PrimaryButton({
  href,
  showArrow = true,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const handleEnter = () => {
    const text = textRef.current
    const icon = iconRef.current
    if (!text || !icon) return

    gsap.to(text, { x: icon.offsetWidth + GAP, duration: 0.45, ease: "power3.out" })
    gsap.to(icon, { x: -(text.offsetWidth + GAP), duration: 0.45, ease: "power3.out" })
  }

  const handleLeave = () => {
    const text = textRef.current
    const icon = iconRef.current
    if (!text || !icon) return

    gsap.to([text, icon], { x: 0, duration: 0.45, ease: "power3.out" })
  }

  const pill = (
    <span
      className={cn(
        "relative inline-flex h-16 items-center overflow-hidden rounded-full bg-primary py-2 hover:bg-background px-6 text-xl font-medium text-primary-foreground transition-all duration-500 group",
        className
      )}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span ref={textRef} className="whitespace-nowrap">
        {children}
      </span>

      {showArrow && (
        <span
          ref={iconRef}
          className="ml-4 hover:mr-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 group-hover:bg-white"
        >
          <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
        </span>
      )}
    </span>
  )

  if (href) {
    return (
      <MagneticButton className="inline-block w-fit">
        <Link href={href} className="inline-flex" data-cursor="magnetic">
          {pill}
        </Link>
      </MagneticButton>
    )
  }

  return (
    <MagneticButton className="inline-block w-fit">
      <button type="button" className="inline-flex cursor-pointer" data-cursor="magnetic" {...props}>
        {pill}
      </button>
    </MagneticButton>
  )
}
