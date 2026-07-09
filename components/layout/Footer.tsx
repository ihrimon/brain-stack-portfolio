"use client"

import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  const resourceLinks = [
    { name: "Blogs", href: "blog" },
    { name: "About", href: "about" },
  ]

  const socialLinks = [
    { name: "X", href: "/" },
    { name: "LinkedIn", href: "/" },
    { name: "Github", href: "/" },
  ]

  return (
    <footer
      className="mt-10 border-t border-border bg-background"
      role="contentinfo"
      itemScope
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          <div className="space-y-8 md:col-span-5 lg:col-span-4">
            <div className="space-y-6">
              <div className="space-y-2 text-label" itemScope>
                <p itemProp="name">
                  <Logo className="text-2xl" />
                </p>
                <p className="text-sm">
                  Copyrights © All Rights Reserved by brainstack.com
                </p>
                <p className="text-sm">
                  <span className="sr-only">Phone:</span>
                  <a
                    href="tel:+19103150746"
                    itemProp="telephone"
                    className="hover:underline"
                  >
                    +1-123455751
                  </a>
                </p>
                <p
                  className="text-sm"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <span itemProp="streetAddress">
                    2055 Limestone Rd STE 200C IN Wilmington
                  </span>
                </p>
                <p className="text-sm">
                  <span itemProp="addressLocality">Wilmington</span>,{" "}
                  <span itemProp="addressRegion">DE</span>{" "}
                  <span itemProp="postalCode">19808</span>
                </p>
              </div>

              <div className="flex">
                <a href="#work-with-us">
                  <Button variant="outline" className="cursor-pointer">
                    Work with us
                    <ArrowUpRight size={16} />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:col-span-1 md:block lg:col-span-2"></div>

          <div className="md:col-span-3 lg:col-span-3">
            <h3
              className="mb-6 text-sm font-medium tracking-wider text-label uppercase"
              id="footer-resources-heading"
            >
              Resources
            </h3>
            <nav
              className="space-y-4"
              aria-labelledby="footer-resources-heading"
            >
              {resourceLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-label transition-colors duration-200 hover:text-heading"
                  aria-label={`Resource: ${link.name}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3 lg:col-span-3">
            <h3
              className="mb-6 text-sm font-medium tracking-wider text-label uppercase"
              id="footer-connect-heading"
            >
              Connect
            </h3>
            <nav className="space-y-4" aria-labelledby="footer-connect-heading">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-label transition-colors duration-200 hover:text-heading"
                  rel="me noopener"
                  aria-label={`Follow us on ${link.name}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
