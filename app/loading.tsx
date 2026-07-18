/**
 * Shown by the App Router's automatic Suspense boundary while a route
 * segment's server data is resolving — mainly the moment between an ISR
 * cache miss and the page finishing its Sheets fetch. Deliberately a plain
 * Server Component with a CSS-only animation (no GSAP, no client JS) so it
 * adds nothing to any route's client bundle and never itself waits on
 * anything.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-screen w-full items-center justify-center bg-background"
    >
      <span className="size-10 animate-spin rounded-full border-2 border-foreground/15 border-t-foreground/60" />
    </div>
  )
}
