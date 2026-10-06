import { ViewTransition } from "react"

/**
 * Page transitions. A template (unlike a layout) re-mounts on every
 * navigation, so this boundary *exits* with the old page and *enters* with
 * the new one — the browser View Transitions API (enabled via
 * `experimental.viewTransition` in next.config.ts) animates between the two
 * snapshots using the `.page-exit` / `.page-enter` rules in globals.css.
 * The navbar and footer live in the root layout, outside this boundary, so
 * they stay put while only the content moves. `default="none"` keeps every
 * other update (and the very first load) from animating. Browsers without
 * View Transitions simply navigate instantly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  )
}
