"use client"

import { Component, type ReactNode } from "react"

interface CanvasErrorBoundaryProps {
  children: ReactNode
}

interface CanvasErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches WebGL context-creation failures (GPU-restricted browsers, some
 * VMs/corporate policies, older devices — reproduced locally via headless
 * Chrome during a Lighthouse pass, see docs/refactoring-audit.md §8) so a
 * purely decorative three.js scene renders nothing instead of throwing past
 * every component boundary up to the route's app/error.tsx and taking the
 * whole page down. Every consumer of this (HeroBackground, BrainWireframe)
 * is `aria-hidden` and layered over a plain CSS background that's already
 * visible without it — there's nothing worth showing in place of the
 * canvas, so a silent no-op fallback is correct here, not a placeholder UI.
 *
 * A class component because React error boundaries have no hook equivalent.
 */
export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("[CanvasErrorBoundary] A three.js canvas failed to render:", error)
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
