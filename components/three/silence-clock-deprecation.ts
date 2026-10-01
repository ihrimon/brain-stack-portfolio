import { setConsoleFunction } from "three"

// @react-three/fiber (latest stable, 9.8.x) still creates a `THREE.Clock`
// for every Canvas root, and three r183+ warns on each one. Nothing in this
// project uses Clock directly, so the warning is pure noise until R3F v10
// (which moves off Clock) is stable — delete this file and its imports then.
//
// Uses three's own console hook rather than patching the global
// `console.warn`, so only messages from three.js pass through here; every
// other three.js message is forwarded exactly as three would print it.
const CLOCK_DEPRECATION = "THREE.Clock: This module has been deprecated"

interface StackTrace {
  isStackTrace: true
  getError: (message: string) => Error
}

function isStackTrace(value: unknown): value is StackTrace {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as StackTrace).isStackTrace === true
  )
}

setConsoleFunction((type, message, ...params) => {
  if (message.startsWith(CLOCK_DEPRECATION)) return

  const [first] = params
  if (isStackTrace(first)) {
    console[type](first.getError(message))
  } else {
    console[type](message, ...params)
  }
})
