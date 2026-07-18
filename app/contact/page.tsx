import { JsonLd } from "@/components/common/JsonLd"
import ContactForm from "@/components/sections/ContactForm"
import ContactSection from "@/components/sections/ContactSection"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

export const metadata = generatePageMetadata("contact")

export default function ContactPage() {
  return (
    <>
      <JsonLd data={generateWebPageSchema("contact")} />
      <main id="main-content" role="main">
        <ContactSection />
        <ContactForm />
      </main>
    </>
  )
}
