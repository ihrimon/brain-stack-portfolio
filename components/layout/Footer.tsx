import { Logo } from "@/components/common/Logo"
import { contactData } from "@/lib/constants/contact"
import { footerData } from "@/lib/constants/footer"
import { navigationData } from "@/lib/constants/navigation"
import { heroTagline } from "@/lib/data/hero"
import { ArrowUpRight, Code2, Compass, PenTool, Workflow, type LucideIcon } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

const columnLabel = "mb-5 font-mono text-[11px] tracking-wider text-ink-2 uppercase"

/** Footer link: on hover a signal-colored underline draws in from the left
 * and a signal arrow slides up into place beside the label. Internal routes use next/link;
 * mailto:/tel: stay plain anchors. */
function FooterLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  const Tag = href.startsWith("/") ? Link : "a"
  return (
    <Tag
      href={href}
      className={`group/fl inline-flex items-center gap-1.5 text-[15px] text-ink ${className ?? ""}`}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-signal transition-transform duration-500 ease-premium group-hover/fl:scale-x-100"
        />
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 shrink-0 -translate-x-1 translate-y-1 text-signal opacity-0 transition-[opacity,translate] duration-500 ease-premium group-hover/fl:translate-x-0 group-hover/fl:translate-y-0 group-hover/fl:opacity-100"
      />
    </Tag>
  )
}

// One icon per step of the Discover → Design → Develop → Automate tagline.
const stepIcons: Record<(typeof heroTagline)[number], LucideIcon> = {
  Discover: Compass,
  Design: PenTool,
  Develop: Code2,
  Automate: Workflow,
}

export default function Footer() {
  return (
    // Dark in both themes — the footer is the page's closing, fixed anchor.
    <footer
      role="contentinfo"
      data-theme="dark"
      className="relative overflow-hidden border-t border-line bg-paper text-ink"
    >
      <div className="mx-auto w-full max-w-site px-4 pt-20 lg:px-6 sm:pt-28">
        <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-8 sm:col-span-2 lg:col-span-5">
            {/* The process as four stacked lines: icon chip, word, step number.
                Hover slides the line, fills the chip and draws a signal rule. */}
            <ol aria-label="How we work" className="max-w-md">
              {heroTagline.map((step, index) => {
                const Icon = stepIcons[step]
                return (
                  <li
                    key={step}
                    className="group relative flex items-center gap-4 border-b border-line py-3 first:pt-0"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal transition-colors duration-500 ease-premium group-hover:bg-signal group-hover:text-signal-ink">
                      <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <span className="text-3xl leading-none font-medium tracking-[-0.03em] text-ink transition-transform duration-500 ease-premium group-hover:translate-x-1.5 sm:text-4xl">
                      {step}
                      <span className="text-signal">.</span>
                    </span>
                    <span className="ml-auto font-mono text-[11px] tracking-wider text-ink-2">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-signal transition-transform duration-700 ease-premium group-hover:scale-x-100"
                    />
                  </li>
                )
              })}
            </ol>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <p className={columnLabel}>Quick Links:</p>
            <ul className="space-y-2.5">
              {navigationData.map((item) => (
                <li key={item.name}>
                  <FooterLink href={item.href}>{item.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-8 lg:col-span-3 lg:col-start-10">
            <div>
              <p className={columnLabel}>Location:</p>
              <p className="text-[15px] text-ink">{contactData.address.line1}</p>
            </div>

            <div>
              <p className={columnLabel}>Contact Us:</p>
              <ul className="space-y-2.5">
                <li>
                  <FooterLink href={`mailto:${contactData.email}`} className="break-all">
                    {contactData.email}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}>
                    {contactData.phone}
                  </FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Wordmark, sized to the content width (container units) so it
            spans the site column edge to edge. It fades over its full visible
            height, solid at the top to transparent where the bottom bar's
            hairline sits; kept at low contrast (ink/25) so it reads as a deep,
            quiet backdrop rather than a highlight; the bar then rises over the lowest ~30%
            (`footer-rise` in globals.css), so it reads as sinking. */}
        <div className="@container mt-20 sm:mt-28">
          <p
            aria-hidden="true"
            className="text-center text-[16.6cqw] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink/25 select-none mask-[linear-gradient(to_bottom,black,transparent_65%)]"
          >
            {footerData.wordmark}
          </p>

          {/* 0.3 × wordmark line box (16.6cqw × 0.8) */}
          <div className="footer-rise relative -mt-[3.98cqw] flex flex-col items-center justify-between gap-4 border-t border-line bg-paper py-6 sm:flex-row">
            <Logo className="text-ink" />
            <p className="font-mono text-[11px] tracking-wider text-ink-2 uppercase">
              © {new Date().getFullYear()} Brain Stack Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
