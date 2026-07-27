const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const logs = []
  page.on("console", (msg) => logs.push(`[${Date.now()}] [console:${msg.type()}] ${msg.text()}`))
  page.on("pageerror", (err) => logs.push(`[${Date.now()}] [pageerror] ${err.message}`))

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 })
  await page.waitForSelector("h1")

  const start = Date.now()
  for (let i = 0; i < 16; i++) {
    const text = await page.evaluate(() => document.querySelector("h1")?.textContent ?? null)
    console.log(`t=${((Date.now() - start) / 1000).toFixed(1)}s h1="${text}"`)
    await page.waitForTimeout(1000)
  }

  console.log("--- console/page logs (relevant only) ---")
  logs
    .filter((l) => /Fast Refresh|HMR|reload|debug|error/i.test(l))
    .forEach((l) => console.log(l))

  await browser.close()
})().catch((e) => {
  console.error("FAIL", e)
  process.exit(1)
})
