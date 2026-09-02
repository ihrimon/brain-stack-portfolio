import { JsonLd } from "@/components/common/JsonLd"
import ContactForm from "@/components/sections/ContactForm"
import ContactSection from "@/components/sections/ContactSection"
import { generatePageMetadata } from "@/lib/metadata"
import { generateWebPageSchema } from "@/lib/structured-data"

// See app/page.tsx for why this is explicit rather than implicit. The
// contact form's mutation happens client-side via a Server Action, not by
// this page itself rendering dynamically.
export const dynamic = "force-static"

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
