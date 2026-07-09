"use client"

import gsap from "gsap"
import { useRef } from "react"
import type { ReactNode } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({
  children,
  className,
  strength = 0.4,
}: MagneticButtonProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapperRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.4,
      ease: "power3.out",
    })
  }

  const handleMouseLeave = () => {
    gsap.to(wrapperRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    })
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="magnetic"
    >
      {children}
    </div>
  )
}
