const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const logs = []
  page.on("console", (msg) => logs.push(`[console:${msg.type()}] ${msg.text()}`))
  page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`))

  const rm = await page.evaluate(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  console.log("prefers-reduced-motion: reduce ->", rm)

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 })
  await page.waitForSelector("h1")

  const dump = async (label) => {
    const info = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("h1"))
      return els.map((el) => ({
        text: el.textContent,
        outer: el.outerHTML.slice(0, 300),
      }))
    })
    console.log(`--- ${label} (${info.length} h1 elements) ---`)
    info.forEach((i, idx) => {
      console.log(`  [${idx}] text=${JSON.stringify(i.text)}`)
      console.log(`       outer=${i.outer}`)
    })
  }

  await dump("t=0s")
  await page.screenshot({ path: "hero-t0.png" })

  await page.waitForTimeout(6000)
  await dump("t=6s")
  await page.screenshot({ path: "hero-t6.png" })

  await page.waitForTimeout(6000)
  await dump("t=12s")
  await page.screenshot({ path: "hero-t12.png" })

  const statsGrid = await page.evaluate(() => {
    const label = Array.from(document.querySelectorAll("[data-panel-metrics] span")).find(
      (el) => el.textContent && el.textContent.length > 25
    )
    if (!label) return null
    const rect = label.getBoundingClientRect()
    return { text: label.textContent, height: rect.height, width: rect.width }
  })
  console.log("stats label box:", JSON.stringify(statsGrid))

  console.log("--- console/page logs ---")
  logs.forEach((l) => console.log(l))

  await browser.close()
})().catch((e) => {
  console.error("FAIL", e)
  process.exit(1)
})
