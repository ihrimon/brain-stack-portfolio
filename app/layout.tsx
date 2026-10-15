import { Cursor } from "@/components/animations/Cursor"
import { BadgeInView } from "@/components/common/BadgeInView"
import { JsonLd } from "@/components/common/JsonLd"
import { ScrollButton } from "@/components/common/ScrollButton"
import Footer from "@/components/layout/Footer"
import { MobileNav } from "@/components/layout/MobileNav"
import { Navbar } from "@/components/layout/Navbar"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import "@/lib/animations/gsap-animations"
import { defaultMetadata } from "@/lib/metadata"
import { generateGlobalSchema } from "@/lib/structured-data"
import { DEFAULT_THEME, themeInitScript } from "@/lib/theme/constants"
import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

// BrainStack AI Receptionist chat widget: the snippet from the dashboard's
// Settings → Install page. It draws a chat button in the corner.
const CHAT_WIDGET_SRC = "https://ai-health-receptionist.vercel.app/chatbot.js"
const CHAT_WIDGET_ID = "cb_dxA0Ntn6sQpSWRWl"

// Variables live on <html> (not <body>) so the theme-independent tokens in
// globals.css can resolve them at :root.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // The init script rewrites data-theme before hydration, so <html>
    // legitimately differs from the server markup for returning visitors.
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        <JsonLd data={generateGlobalSchema()} />
        <Cursor />
        <BadgeInView />
        <ScrollButton />
        <SmoothScroll>
          <div className="min-h-screen w-full pb-20 lg:pb-0">
            <Navbar />
            {children}
            <Footer />
          </div>
        </SmoothScroll>
        <MobileNav />
        {/* lazyOnload: fetched once the page is idle, so it never slows it
            down. data-bottom lifts the chat button above MobileNav's bar
            and ScrollButton (bottom-8, size-14) instead of covering them. */}
        <Script
          src={CHAT_WIDGET_SRC}
          data-chatbot-id={CHAT_WIDGET_ID}
          data-bottom="96"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
