"use client"

import { cn } from "@/lib/utils/cn"
import Image from "next/image"
import Link from "next/link"
import { type ComponentPropsWithoutRef } from "react"

interface PrimaryButtonProps extends ComponentPropsWithoutRef<"button"> {
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
  const pill = (
    <span
      className={cn(
        "group inline-flex h-16 items-center rounded-full bg-neutral-900 px-6 text-xl font-medium text-white",
        className
      )}
    >
      <span className="whitespace-nowrap">{children}</span>

      {showArrow && (
        <span className="ml-4 flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors group-hover:bg-white">
          <Image src="/icons/arrow-right.svg" alt="" width={16} height={16} />
        </span>
      )}
    </span>
  )

  if (href) {
    const isExternal = /^https?:\/\//.test(href)

    return (
      <Link
        href={href}
        className="inline-block w-fit"
        data-cursor="magnetic"
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {pill}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className="inline-flex w-fit cursor-pointer"
      data-cursor="magnetic"
      {...props}
    >
      {pill}
    </button>
  )
}
