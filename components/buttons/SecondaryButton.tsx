"use client"

import { MagneticButton } from "@/components/animations/MagneticButton"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ComponentProps } from "react"

interface SecondaryButtonProps extends ComponentProps<typeof Button> {
  href?: string
}

export function SecondaryButton({
  href,
  className,
  children,
  ...props
}: SecondaryButtonProps) {
  const content = (
    <Button
      variant="outline"
      size="lg"
      className={cn("rounded-full", className)}
      asChild={!!href}
      {...props}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </Button>
  )

  return <MagneticButton className="inline-block w-fit">{content}</MagneticButton>
}
