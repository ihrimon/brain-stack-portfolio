const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })

  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 })
  await page.waitForTimeout(2000)
  await page.evaluate(() => {
    document.querySelector("#team")?.scrollIntoView({ block: "start" })
  })
  await page.waitForTimeout(1500)

  const debug = await page.evaluate(() => {
    const section = document.querySelector("#team")
    const wrapper = section?.querySelector(":scope > div") // mx-auto max-w-400
    const outerGrid = wrapper?.children?.[0] // grid gap-16 lg:grid-cols-...
    const contentCol = outerGrid?.children?.[0]
    const photoGrid = outerGrid?.children?.[1]
    const firstPhotoItem = photoGrid?.children?.[0]
    const img = firstPhotoItem?.querySelector("img")

    const rectOf = (el) => (el ? el.getBoundingClientRect() : null)
    const styleOf = (el) =>
      el
        ? (() => {
            const s = getComputedStyle(el)
            return {
              display: s.display,
              gridTemplateColumns: s.gridTemplateColumns,
              width: s.width,
              height: s.height,
              aspectRatio: s.aspectRatio,
              position: s.position,
              overflow: s.overflow,
              maxWidth: s.maxWidth,
              visibility: s.visibility,
              opacity: s.opacity,
            }
          })()
        : null

    return {
      outerGridRect: rectOf(outerGrid),
      contentColRect: rectOf(contentCol),
      photoGridRect: rectOf(photoGrid),
      photoGridStyle: styleOf(photoGrid),
      photoGridChildCount: photoGrid?.children?.length,
      photoGridOuterHTMLStart: photoGrid?.outerHTML?.slice(0, 200),
      firstPhotoItemRect: rectOf(firstPhotoItem),
      firstPhotoItemStyle: styleOf(firstPhotoItem),
      imgRect: rectOf(img),
      imgStyle: styleOf(img),
      imgOuterHTML: img?.outerHTML?.slice(0, 300),
    }
  })

  console.log(JSON.stringify(debug, null, 2))

  await browser.close()
})().catch((e) => {
  console.error("FAIL", e.message)
  process.exit(1)
})
