"use client"

import { Blob } from "./Blob"
import {
  BLOB_LAYOUTS,
  BLOOM,
  GEOMETRY_DETAIL,
  PARTICLE_COUNT,
  type Tier,
} from "./constants"
import { Effects } from "./Effects"
import { Lights } from "./Lights"
import { useMouseTracker } from "./MouseController"
import { Particles } from "./Particles"
import { SceneEnvironment } from "./SceneEnvironment"

interface SceneProps {
  tier: Tier
  reducedMotion: boolean
}

/** Composes everything that lives inside the `<Canvas>`: lights, the baked
 * environment, the blob field, ambient particles, and (desktop/tablet only)
 * the bloom pass. Rendered fresh whenever `tier` changes — the parent
 * remounts this via `key={tier}`, so it's safe to treat `tier` as constant
 * for the lifetime of one mount. */
export function Scene({ tier, reducedMotion }: SceneProps) {
  const mouseRef = useMouseTracker()
  const bloom = BLOOM[tier]

  return (
    <>
      <Lights mouseRef={mouseRef} reducedMotion={reducedMotion} />
      <SceneEnvironment />

      {BLOB_LAYOUTS[tier].map((config) => (
        <Blob
          key={config.id}
          config={config}
          detail={GEOMETRY_DETAIL[tier]}
          mouseRef={mouseRef}
          reducedMotion={reducedMotion}
        />
      ))}

      <Particles count={PARTICLE_COUNT[tier]} reducedMotion={reducedMotion} />

      {bloom && !reducedMotion && (
        <Effects
          strength={bloom.strength}
          radius={bloom.radius}
          threshold={bloom.threshold}
        />
      )}
    </>
  )
}
