import { Logo } from "@/components/common/Logo"
import { contactData } from "@/lib/constants/contact"
import { footerData } from "@/lib/constants/footer"
import { navigationData } from "@/lib/constants/navigation"
import { BLUR_DATA_URL } from "@/lib/utils/image-placeholder"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden bg-brand-dark"
      role="contentinfo"
    >
      {/* <Image
        src="/images/bg-footer.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-top opacity-70"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
      /> */}
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-brand-dark/50 to-brand-dark"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-400 px-5 pt-20 sm:px-8 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto_auto] lg:gap-16">
          <div className="space-y-8">
            <h2 className="max-w-md text-4xl leading-[1.05] font-bold tracking-tight text-white uppercase sm:text-5xl">
              {footerData.heading}
            </h2>

            <div className="flex items-center gap-3">
              {contactData.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="flex size-11 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white uppercase transition-colors hover:bg-white/20"
                  data-cursor="magnetic"
                >
                  {social.glyph}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-medium tracking-wider text-white/60 uppercase">
              Quick Links:
            </h3>
            <div className="flex max-w-xs flex-wrap gap-3">
              {navigationData.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
                  data-cursor="magnetic"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-sm font-medium tracking-wider text-white/60 uppercase">
                Location:
              </h3>
              <p className="text-white">
                {contactData.address.line1}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium tracking-wider text-white/60 uppercase">
                Contact Us:
              </h3>
              <p className="text-white">
                <a
                  href={`mailto:${contactData.email}`}
                  className="hover:underline"
                >
                  {contactData.email}
                </a>
                <br />
                <a
                  href={`tel:${contactData.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:underline"
                >
                  {contactData.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 overflow-hidden">
        <p
          aria-hidden="true"
          className="bg-linear-to-b from-white/20 to-transparent bg-clip-text px-2 text-[15vw] leading-none font-bold whitespace-nowrap text-transparent select-none"
        >
          {footerData.wordmark}
        </p>
      </div>

      <div className="relative z-10 max-w-full border-t border-white/10">
        <div className="mx-auto flex max-w-400 flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-white/40 sm:flex-row sm:px-8">
          <Logo variant="on-dark" />
          <p className="text-base">
            © {new Date().getFullYear()} Brain Stack Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
