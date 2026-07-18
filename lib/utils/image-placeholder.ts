/**
 * A single tiny (8x8) solid-color SVG, base64-encoded, used as the
 * `blurDataURL` for `next/image` on content photos that don't have
 * `priority` (team/testimonial/blog/project images). Next's built-in
 * blur-generation only works for local static imports — every image in
 * this app is a runtime string (local `/images/...` path or a remote
 * Sheets-supplied URL), so it can't be auto-generated. A flat placeholder
 * matching the site's dark surfaces (`neutral-900`, #18181b) is a
 * deliberately simple stand-in: it avoids a jarring flash while the real
 * image loads without needing a per-image generated placeholder.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiMxODE4MWIiLz48L3N2Zz4="
