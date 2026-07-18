import ContactForm from "@/components/sections/ContactForm"
import ContactSection from "@/components/sections/ContactSection"
import { generatePageMetadata } from "@/lib/metadata"

export const metadata = generatePageMetadata("contact")

export default function ContactPage() {
  return (
    <main id="main-content" role="main">
      <ContactSection />
      <ContactForm />
    </main>
  )
}
