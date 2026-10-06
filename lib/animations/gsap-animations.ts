/* eslint-disable @typescript-eslint/no-explicit-any */

import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

interface FadeUpScrollConfig {
  start?: string;
  duration?: number;
  yOffset?: number;
  ease?: string;
  once?: boolean;
  markers?: boolean;
  delay?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

interface StaggerFadeUpOnScrollConfig {
  start?: string;
  duration?: number;
  yOffset?: number;
  ease?: string;
  once?: boolean;
  markers?: boolean;
  delay?: number;
  stagger?: number;
  childSelector?: string;
  onStart?: () => void;
  onComplete?: () => void;
}

interface FadeUpConfig {
  duration?: number;
  yOffset?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  onStart?: () => void;
  onComplete?: () => void;
}

gsap.registerEffect({
  name: "fadeUp",
  effect: (targets: gsap.TweenTarget, config: FadeUpConfig) => {
    // Set initial state
    gsap.set(targets, {
      autoAlpha: 0,
      y: config.yOffset,
      opacity: 0,
    });

    // Return animation timeline
    return gsap.to(targets, {
      duration: config.duration,
      autoAlpha: 1,
      y: 0,
      opacity: 1,
      ease: config.ease,
      delay: config.delay,
      stagger: config.stagger,
      onStart: config.onStart,
      onComplete: config.onComplete,
    });
  },
  defaults: {
    duration: 0.8,
    yOffset: 50,
    ease: "sine.out",
    delay: 0,
    stagger: 0,
  },
  extendTimeline: true,
});

gsap.registerEffect({
  name: "fadeUpOnScroll",
  effect: (targets: gsap.TweenTarget, config: FadeUpScrollConfig) => {
    const elements = gsap.utils.toArray(targets);
    const triggers: ScrollTrigger[] = [];

    elements.forEach((element: any) => {
      gsap.set(element, {
        autoAlpha: 0,
        y: config.yOffset,
        opacity: 0,
      });

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: config.start,
        once: config.once,
        markers: config.markers,
        onEnter: () => {
          if (config.onStart) config.onStart();

          gsap.to(element, {
            duration: config.duration,
            autoAlpha: 1,
            y: 0,
            opacity: 1,
            ease: config.ease,
            delay: config.delay,
            onComplete: config.onComplete,
          });
        },
      });

      triggers.push(trigger);
    });

    return triggers;
  },
  defaults: {
    duration: 0.8,
    yOffset: 50,
    ease: "sine.out",
    start: "top 90%",
    once: true,
    markers: false,
    delay: 0,
  },
});

gsap.registerEffect({
  name: "staggerFadeUpOnScroll",
  effect: (targets: gsap.TweenTarget, config: StaggerFadeUpOnScrollConfig) => {
    const containers = gsap.utils.toArray<HTMLElement>(targets as HTMLElement[]);
    const triggers: ScrollTrigger[] = [];

    containers.forEach((container) => {
      const children: Element[] = config.childSelector
        ? Array.from(container.querySelectorAll(config.childSelector))
        : Array.from(container.children);

      if (children.length === 0) return;

      gsap.set(children, {
        autoAlpha: 0,
        y: config.yOffset,
        opacity: 0,
      });

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: config.start,
        once: config.once,
        markers: config.markers,
        onEnter: () => {
          if (config.onStart) config.onStart();

          gsap.to(children, {
            duration: config.duration,
            autoAlpha: 1,
            y: 0,
            opacity: 1,
            ease: config.ease,
            delay: config.delay,
            stagger: config.stagger,
            onComplete: config.onComplete,
          });
        },
      });

      triggers.push(trigger);
    });

    return triggers;
  },
  defaults: {
    duration: 0.7,
    yOffset: 40,
    ease: "sine.out",
    start: "top 85%",
    once: true,
    markers: false,
    delay: 0,
    stagger: 0.12,
    childSelector: undefined,
  },
});

interface TextRevealOnScrollConfig {
  start?: string;
  end?: string;
  scrub?: number | boolean;
  stagger?: number;
  mutedOpacity?: number;
}

/** Resolves the theme's secondary-text color (`--ink-2`) as an rgb() string
 * in `el`'s context, so it compares cleanly against computed colors. */
function mutedColorFor(el: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.color = "var(--ink-2)";
  el.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

// Splits each target into words that start dimmed and reveal word-by-word to
// full opacity as the element is scrolled through, rather than fading in
// all at once. Used to keep every section's title/description reveal
// feeling consistent across the site.
//
// The muted opacity (0.55) is chosen so primary-ink text still clears WCAG
// contrast before it's revealed, in both themes. Secondary text (`--ink-2`)
// would drop below that when dimmed, so it's left as-is. Opacity (not a
// color tween) keeps the effect correct across live light/dark switches.
// `aria: "none"` stops SplitText adding an aria-label to the (role-less)
// container, which isn't a valid place for one — the words are
// plain text nodes, so assistive tech still reads them naturally.
gsap.registerEffect({
  name: "textRevealOnScroll",
  effect: (targets: gsap.TweenTarget, config: TextRevealOnScrollConfig) => {
    // Callers pass refs that may be null (e.g. an optional description that
    // wasn't rendered) or elements with no text — skip those so GSAP doesn't
    // warn about missing targets.
    const elements = gsap.utils
      .toArray<HTMLElement | null>(targets)
      .filter((el): el is HTMLElement => !!el && !!el.textContent?.trim());
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el) => {
      const fullColor = getComputedStyle(el).color;
      const mutedColor = mutedColorFor(el);
      if (fullColor === mutedColor) return;

      const split = SplitText.create(el, { type: "words", aria: "none" });
      if (!split.words.length) {
        split.revert();
        return;
      }
      gsap.set(split.words, { opacity: config.mutedOpacity });

      const tween = gsap.to(split.words, {
        opacity: 1,
        stagger: config.stagger,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: config.start,
          end: config.end,
          scrub: config.scrub,
        },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return triggers;
  },
  defaults: {
    start: "top 85%",
    end: "bottom 55%",
    scrub: 0.5,
    mutedOpacity: 0.55,
    stagger: 0.05,
  },
});
