import { Cursor } from "@/components/animations/Cursor"
import { Loader } from "@/components/animations/Loader"
import { JsonLd } from "@/components/common/JsonLd"
import { ScrollButton } from "@/components/common/ScrollButton"
import Footer from "@/components/layout/Footer"
import { MobileNav } from "@/components/layout/MobileNav"
import { Navbar } from "@/components/layout/Navbar"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import { ThemeProvider } from "@/components/theme/theme-provider"
import "@/lib/animations/gsap-animations"
import { defaultMetadata } from "@/lib/metadata"
import { generateGlobalSchema } from "@/lib/structured-data"
import { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"

const sora = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${inter.variable} bg-background text-foreground antialiased`}
      >
        <JsonLd data={generateGlobalSchema()} />
        <ThemeProvider>
          <Loader />
          <Cursor />
          <ScrollButton />
          <SmoothScroll>
            <div className="min-h-screen w-full pb-20 lg:pb-0">
              <Navbar />
              {children}
              <Footer />
            </div>
          </SmoothScroll>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
