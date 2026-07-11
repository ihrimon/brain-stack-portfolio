import { defaultMetadata } from "@/lib/metadata"
import { Metadata } from "next"
import { Inter, Sora } from "next/font/google"
import "./globals.css"
import { Navbar } from '@/components/layout/Navbar'
import { MobileNav } from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import { Loader } from '@/components/animations/Loader'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Cursor } from '@/components/animations/Cursor'
import { ScrollButton } from '@/components/common/ScrollButton'
import { ThemeProvider } from '@/components/theme/theme-provider'
import "@/lib/GSAPAnimations"

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
