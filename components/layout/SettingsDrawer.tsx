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
import { contactData } from "@/lib/data/contact"
import { Mail, MapPin, Phone, X } from "lucide-react"

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="rounded-none! p-0">
        <div className="flex h-full flex-col overflow-y-auto bg-background text-foreground p-6">
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
            <Logo href={false} />
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close settings"
                className="flex size-12 items-center justify-center rounded-full border border-border text-heading hover:bg-muted cursor-pointer"
              >
                <X className="size-6" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex flex-col gap-8 py-6">
            <section>
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

            <section className="space-y-5 border-t border-border pt-6">
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Mail className="size-4 text-heading" />
                </div>
                <div>
                  <p className="text-xs text-label">Send Us Mail</p>
                  <p className="text-sm font-medium text-heading">
                    {contactData.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Phone className="size-4 text-heading" />
                </div>
                <div>
                  <p className="text-xs text-label">{contactData.phoneHours}</p>
                  <p className="text-sm font-medium text-heading">
                    {contactData.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <MapPin className="size-4 text-heading" />
                </div>
                <div>
                  <p className="text-xs text-label">Visit Office</p>
                  <p className="text-sm font-medium text-heading">
                    {contactData.address.line1}
                    <br />
                    {contactData.address.line2}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <DrawerFooter className="mt-auto border-t border-border">
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
