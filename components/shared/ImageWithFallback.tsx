"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
  src?: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  loading?: "eager" | "lazy" | undefined
  priority?: boolean
  className?: string
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  loading,
  priority,
  className,
}: Props) {
  const [imgSrc, setImgSrc] = useState(src || "/images/placeholder.png")

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      loading={loading}
      priority={priority ?? false}
      onError={() => setImgSrc("/images/placeholder.png")}
    />
  )
}
