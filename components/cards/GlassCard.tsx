import { cn } from "@/lib/utils/cn"
import type { ComponentPropsWithoutRef } from "react"

interface GlassCardProps extends ComponentPropsWithoutRef<"div"> {
  hoverLift?: boolean
}

export function GlassCard({
  className,
  hoverLift = true,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-3xl p-6 shadow-lg transition-transform duration-300 sm:p-8",
        hoverLift && "hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
