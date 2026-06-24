"use client"

import { portfolioData } from '@/data/portfolio-data'
import Link from "next/link"

export function Footer() {
  const { footer } = portfolioData

  return (
    <footer className="border-t border-border bg-foreground/5">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-12 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 text-lg font-bold"
            >
              <span className="text-2xl">🧠</span>
              <span>Brain Stack</span>
            </Link>
            <p className="text-foreground/60">
              Premium software development consulting delivering scalable,
              enterprise-grade solutions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Quick Links</h3>
            <ul className="space-y-2">
              {footer.links.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Connect</h3>
            <div className="flex gap-4">
              {footer.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10 text-lg transition-colors hover:bg-foreground/20"
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
