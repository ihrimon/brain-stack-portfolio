"use client"

import { ColorPaletteSwitcher } from "@/components/common/ColorPaletteSwitcher"
import { Logo } from "@/components/common/Logo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer"
import { contactData } from "@/lib/constants/contact"
import { navigationData } from "@/lib/constants/navigation"
import { cn } from "@/lib/utils/cn"
import { ArrowUpRight, Mail, MapPin, Phone, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const pathname = usePathname()

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="rounded-none! p-0">
        <div className="flex h-full flex-col overflow-y-auto bg-background p-6 text-foreground">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border px-0 pb-4">
            <Logo href={false} />
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close settings"
                className="group flex size-12 cursor-pointer items-center justify-center rounded-full border border-border text-heading hover:bg-muted"
              >
                <X className="size-6 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex flex-col gap-8 py-6">
            <nav aria-label="Full site navigation">
              <ul className="flex flex-col divide-y divide-border">
                {navigationData.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        aria-current={isActive ? "page" : undefined}
                        className="group flex items-center justify-between gap-4 py-4"
                        data-cursor="magnetic"
                      >
                        <span className="flex items-baseline gap-3">
                          <span
                            className={cn(
                              "text-xs font-medium",
                              isActive ? "text-primary" : "text-label"
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="relative inline-flex overflow-hidden text-2xl font-medium tracking-tight">
                            <span
                              className={cn(
                                "block transition-transform duration-300 ease-out group-hover:-translate-y-full",
                                isActive ? "text-primary" : "text-heading"
                              )}
                            >
                              {item.name}
                            </span>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 block translate-y-full text-primary transition-transform duration-300 ease-out group-hover:translate-y-0"
                            >
                              {item.name}
                            </span>
                          </span>
                        </span>

                        <ArrowUpRight className="size-5 -translate-x-2 text-label opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-primary group-hover:opacity-100" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <section className="border-t border-border pt-6">
              <h3 className="mb-3 text-xs font-semibold tracking-wider text-label uppercase">
                Appearance
              </h3>
              <ThemeToggle />
            </section>

            <section>
              <h3 className="mb-3 text-xs font-semibold tracking-wider text-label uppercase">
                Theme Color
              </h3>
              <ColorPaletteSwitcher />
            </section>
          </div>

          <DrawerFooter className="mt-auto border-t border-border px-0">
            <p className="mb-3 text-xs font-semibold tracking-wider text-label uppercase">
              Follow Us
            </p>
            <div className="flex gap-2">
              {contactData.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-semibold text-heading hover:bg-accent hover:text-accent-foreground"
                >
                  {social.glyph}
                </a>
              ))}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
