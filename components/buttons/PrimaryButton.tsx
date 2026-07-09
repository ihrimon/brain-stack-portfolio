"use client"

import { MagneticButton } from "@/components/animations/MagneticButton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ComponentProps } from "react"

interface PrimaryButtonProps extends ComponentProps<typeof Button> {
  href?: string
  showArrow?: boolean
}

export function PrimaryButton({
  href,
  showArrow = true,
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  const content = (
    <Button
      size="lg"
      className={cn("rounded-full", className)}
      asChild={!!href}
      {...props}
    >
      {href ? (
        <Link href={href}>
          {children}
          {showArrow && <ArrowRight className="size-4" />}
        </Link>
      ) : (
        <>
          {children}
          {showArrow && <ArrowRight className="size-4" />}
        </>
      )}
    </Button>
  )

  return <MagneticButton className="inline-block w-fit">{content}</MagneticButton>
}
