import { defaultMetadata } from "@/lib/metadata"
import { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Loader } from '@/components/animations/Loader'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Cursor } from '@/components/animations/Cursor'
import { ThemeProvider } from '@/components/theme/theme-provider'
import "@/lib/GSAPAnimations"

const geistSans = Geist({
  variable: "--font-geist-sans",
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
        className={`${geistSans.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <Loader />
          <Cursor />
          <SmoothScroll>
            <div className="min-h-screen w-full">
              <Navbar />
              {children}
              <Footer />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  )
}
