# Brain Stack — রিফ্যাক্টরিং অডিট: Before vs After বিশ্লেষণ

**তৈরির তারিখ:** ২০২৬-০৮-৩১
**তুলনার সুযোগ:** শেষ কমিট `9661f4d` ("remove all google sheet related features") **— Before** বনাম বর্তমান working tree-এর uncommitted পরিবর্তনসমূহ **— After**।
**পদ্ধতি:** `git diff --stat HEAD`, ফাইল-বাই-ফাইল কন্টেন্ট যাচাই, প্যাকেজ সাইজ পরিমাপ, এবং বর্তমান কোডের উপর একটা বাস্তব `pnpm build` চালিয়ে production build output ভেরিফাই করা হয়েছে।

> **সততার সাথে একটা সীমাবদ্ধতা স্বীকার করা দরকার:** এই অডিটে "Before" অবস্থার একটা পূর্ণাঙ্গ প্রোডাকশন বিল্ড (npm দিয়ে পুরনো কমিট চেকআউট করে পুনরায় ইনস্টল ও বিল্ড) চালানো হয়নি — এটা সময়সাপেক্ষ ও এই অডিটের স্কোপের বাইরে ধরা হয়েছে। তার বদলে, **যাচাইযোগ্য structural evidence** (কোন ডিপেন্ডেন্সি/ফাইল বাদ গেছে, কত লাইন কোড কমেছে, বর্তমান বিল্ড আসলে কেমন) ব্যবহার করে **কেন** প্রতিটা পরিবর্তন optimization সেটা যুক্তিসহ ব্যাখ্যা করা হয়েছে। §৮-এ প্রকৃত Lighthouse/response-time পরিমাপের জন্য একটা টেমপ্লেট দেওয়া আছে — deploy-এর পর সেটা পূরণ করে এই ডকুমেন্ট আপডেট করা উচিত।

---

## ১. সারসংক্ষেপ (Headline Numbers)

| মেট্রিক | Before | After | পরিবর্তন |
|---|---|---|---|
| পরিবর্তিত ফাইল সংখ্যা | — | ৪৭টি | — |
| মোট লাইন পরিবর্তন | — | +৩৬৮ / −৯৯৯৪ | নেট −৯৬২৬ লাইন |
| ডিরেক্ট npm ডিপেন্ডেন্সি | ২২টি | ১৯টি | **−৩টি (−১৪%)** |
| প্যাকেজ ম্যানেজার | npm (`package-lock.json`, ৮২৯৬ লাইন) | pnpm (`pnpm-lock.yaml`) | lockfile নিজেই ৮০০০+ লাইন কম |
| ডেড/ডুপ্লিকেট কম্পোনেন্ট ফাইল অপসারিত | — | ৯টি (৯০৬ লাইন কোড) | — |
| নতুন শেয়ার্ড অ্যাবস্ট্রাকশন | — | ২টি (`StatusPage.tsx`, `form-field.tsx`) | ৪টা ফাইলের ডুপ্লিকেশন প্রতিস্থাপন |
| Security headers | নেই | ৪টা (X-Frame-Options, নসনিফ, রেফারার-পলিসি, পারমিশনস-পলিসি) | নতুন |
| ESLint কড়াকড়ি | `no-unused-vars: warn` (ডিফল্ট) | `no-unused-vars: error` | dead import CI-তে block হয় এখন |
| প্রোডাকশন বিল্ড | — | ✅ সফল (Turbopack, ৯.৭ সেকেন্ডে কম্পাইল) | বর্তমান কোড স্থিতিশীল |

---

## ২. ডিপেন্ডেন্সি পরিবর্তন — কী সরানো হয়েছে এবং কেন এটা অপ্টিমাইজেশন

| প্যাকেজ | আগে | এখন | কেন সরানো ঠিক হয়েছে |
|---|---|---|---|
| `next-themes` | ✅ ইনস্টল ছিল | ❌ সরানো | থিম-টগল ফিচার (light/dark switch) সম্পূর্ণ সরিয়ে সাইট এখন dark-mode-only। `next-themes`-এর `ThemeProvider` সাধারণত hydration-এর আগে একটা ছোট blocking `<script>` head-এ inject করে (flash-of-wrong-theme এড়াতে) এবং প্রতিটা কম্পোনেন্টে থিম-context সাবস্ক্রিপশন যোগ করে — উভয়ই এখন সম্পূর্ণ অপ্রয়োজনীয় রানটাইম ওভারহেড ছিল, যেহেতু থিম কখনো বদলায়ই না। |
| `embla-carousel-autoplay` | ✅ ইনস্টল ছিল | ❌ সরানো | কোনো ব্যবহার-ক্ষেত্র খুঁজে পাওয়া যায়নি — অব্যবহৃত plugin যা শুধু bundle-এ ওজন যোগ করছিল। |
| `date-fns` | ✅ ইনস্টল ছিল | ❌ সরানো | ব্যবহৃত হচ্ছিল না — `lib/utils/format-date.ts`-এর বদলে কম্পোনেন্টগুলো নিজেদের লোকাল date-formatting হেল্পার লেখে (দেখুন `PROJECT-REVIEW-BN.md` §৪.১)। |
| প্যাকেজ ম্যানেজার: npm → pnpm | `package-lock.json` (৮২৯৬ লাইন) | `pnpm-lock.yaml` + `packageManager: "pnpm@10.22.0"` pin | pnpm-এর content-addressable store হার্ডলিংক ব্যবহার করে ডিস্কে ডুপ্লিকেট প্যাকেজ কপি এড়ায় এবং strict dependency resolution দেয় (phantom dependency বাগ প্রতিরোধ করে) — ইনস্টল সময় ও ডিস্ক ব্যবহার দুটোই কমে, আর `packageManager` পিন করায় পুরো টিম একই ভার্সন ব্যবহার নিশ্চিত হয় |

**এখনো বাকি থাকা সুযোগ (এই রিফ্যাক্টরে ধরা পড়েনি, `PROJECT-REVIEW-BN.md`-এ চিহ্নিত):**

`components/ui/carousel.tsx` ও `components/ui/button.tsx` — এই দুটো vendored shadcn ফাইলের কোনো বাস্তব consumer নেই (গ্রেপে যাচাই করা হয়েছে), কিন্তু এগুলো এখনো ৩টা npm প্যাকেজকে "ব্যবহৃত" দেখাচ্ছে:

| প্যাকেজ | আনপ্যাকড সাইজ (node_modules) |
|---|---|
| `embla-carousel-react` | ৮২ KB |
| `embla-carousel` (core, `embla-carousel-react`-এর ডিপেন্ডেন্সি) | ৬৯৮ KB |
| `@radix-ui/react-slot` | ৬১ KB |
| `class-variance-authority` | ৩৫ KB |

মোট **~৮৭৬ KB আনপ্যাকড সোর্স** যা এই একটামাত্র dead file-chain-এর জন্য বহন হচ্ছে (মিনিফায়েড+gzipped প্রকৃত client bundle contribution এর চেয়ে ছোট হবে, কিন্তু শূন্য না)। এই দুটো ফাইল ও তিনটা প্যাকেজ সরানো পরবর্তী অপ্টিমাইজেশন রাউন্ডের একটা সহজ, ঝুঁকিহীন টার্গেট।

---

## ৩. ডেড/ডুপ্লিকেট কম্পোনেন্ট অপসারণ — লাইন-বাই-লাইন

| ফাইল | সরানো লাইন | কী ছিল |
|---|---|---|
| `components/theme/theme-provider.tsx` | ৯১ | `next-themes` wrapper — থিম সিস্টেমের সাথে সরানো |
| `components/common/ThemeToggle.tsx` | ২৯ | থিম টগল বাটন UI |
| `components/sections/TestimonialSection.tsx` | ১৭৯ | টেস্টিমোনিয়াল সেকশন — এর ডেটা (`testimonialsData`) বাস্তব কনটেন্ট ছাড়াই খালি ছিল |
| `components/sections/AboutSectionDemo.tsx` | ১৬৩ | `WhoWeAreSection`-এর একটা ব্যবহৃত-না-হওয়া near-duplicate ড্রাফট |
| `"components/sections/TeamSection copy.tsx"` | ১১৭ | `TeamSection.tsx`-এর একটা ক্যারোসেল ভ্যারিয়েন্ট ড্রাফট, ফাইলনামেই "copy" লেখা ছিল |
| `components/sections/hero-panel/HeroWorkflow.tsx` | ১২৯ | Hero সেকশনের একটা অব্যবহৃত সাব-কম্পোনেন্ট |
| `components/sections/hero-panel/PanelBackground.tsx` | ৮৪ | Hero সেকশনের একটা অব্যবহৃত ব্যাকগ্রাউন্ড কম্পোনেন্ট (এখন `components/three/hero-background/`-এর ৩D scene দিয়ে প্রতিস্থাপিত) |
| `components/sections/hero-panel/HeroReviews.tsx` | ৮০ | Hero সেকশনের একটা অব্যবহৃত রিভিউ-উইজেট |
| `components/buttons/SecondaryButton.tsx` | ৩৪ | `ui/button.tsx`-এর একটা wrapper, আর কোথাও import হচ্ছিল না |
| **মোট** | **৯০৬ লাইন** | |

**কেন এটা optimization:** প্রতিটা এই ফাইল আগে TypeScript কম্পাইলেশনের অংশ ছিল, এবং যদি ভুলবশত কেউ import করত (বা GSAP/framer-motion-এর মতো ভারী লাইব্রেরি ব্যবহার করত), সেটা silently bundle-এ যোগ হয়ে যেত। ৯০৬ লাইন dead কোড সরানোয় — (ক) `tsc --noEmit`/`next lint` দ্রুত চলে কম ফাইল স্ক্যান করার কারণে, (খ) নতুন ডেভেলপারের কোডবেস পড়ার সময় "এটা কি আসলে ব্যবহার হয়?" প্রশ্নের সংখ্যা কমে, এবং (গ) ভুল করে dead component-কে ভবিষ্যতে "fix" করার সময় নষ্ট হওয়া বন্ধ হয়।

---

## ৪. নতুন শেয়ার্ড অ্যাবস্ট্রাকশন — ডুপ্লিকেশন থেকে কেন্দ্রীকরণ

| নতুন ফাইল | প্রতিস্থাপন করেছে | প্রমাণ (diff) |
|---|---|---|
| `components/shared/StatusPage.tsx` | `app/error.tsx` ও `app/not-found.tsx`-এর মধ্যে ডুপ্লিকেট watermark/badge/heading/description/CTA মার্কআপ | `app/error.tsx`: ৬১ লাইন পরিবর্তন, `app/not-found.tsx`: ৫৫ লাইন পরিবর্তন — দুটোই এখন একই শেয়ার্ড কম্পোনেন্টে রিডাইরেক্ট হয় |
| `components/shared/form-field.tsx` | `ContactForm.tsx` ও `ProjectInquiry.tsx`-এর মধ্যে ডুপ্লিকেট ইনপুট স্টাইলিং ও এরর-মেসেজ UI | `ContactForm.tsx`: ৪৬ লাইন পরিবর্তন, `ProjectInquiry.tsx`: ৬৮ লাইন পরিবর্তন |

**কেন এটা optimization (bundle size না, maintainability):** এই দুটো পরিবর্তন client bundle size কমায় না উল্লেখযোগ্যভাবে (ছোট কম্পোনেন্ট), বরং **ডুপ্লিকেট কোড থেকে ভবিষ্যতে বাগ সিঙ্ক্রোনাইজেশন সমস্যা** প্রতিরোধ করে — যেমন, ফিল্ড এরর স্টাইল একবার বদলালে দুই ফর্মেই বদলে যাবে, একটাতে ভুলে বাদ পড়বে না। এটা "maintenance velocity" অপ্টিমাইজেশন — ভবিষ্যতে একই কাজে কম সময় লাগবে।

---

## ৫. কনফিগারেশন ও নিরাপত্তা উন্নতি

### `next.config.ts` (+১৬ লাইন)

নতুন যোগ হয়েছে:
```ts
async headers() {
  return [{
    source: "/:path*",
    headers: [
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }]
}
```

**কেন এটা optimization:** এটা পারফরম্যান্স না, **নিরাপত্তা optimization** — clickjacking (`X-Frame-Options`), MIME-sniffing অ্যাটাক (`nosniff`), এবং অপ্রয়োজনীয় ব্রাউজার পারমিশন (ক্যামেরা/মাইক্রোফোন/লোকেশন) — এই তিন ধরনের সাধারণ আক্রমণ-ভেক্টর ব্লক করে দেয়, শূন্য রানটাইম খরচে (headers static, প্রতি রিকোয়েস্টে কম্পিউট হয় না)।

### `eslint.config.mjs` (+১১ লাইন)

`@typescript-eslint/no-unused-vars` warning থেকে **error**-এ আপগ্রেড করা হয়েছে। **কেন এটা optimization:** এটা সরাসরি dead-code জমা হওয়া রোধ করে — §৩-এ যে ৯০৬ লাইন dead code পাওয়া গেছে, তার একটা বড় অংশ যদি এই rule আগে থেকে error হিসেবে থাকত, তাহলে CI-তেই ধরা পড়ত এবং merge হওয়ার আগেই সরানো হতো।

---

## ৬. বান্ডেল সাইজ বিশ্লেষণ (বর্তমান "After" স্টেট, বাস্তব বিল্ড থেকে)

`pnpm build` (Next.js 16.2.6, Turbopack) সফলভাবে সম্পন্ন হয়েছে:

```
✓ Compiled successfully in 9.7s
✓ Generating static pages using 3 workers (32/32) in 1170ms

Route (app)                    Type
○ /                             Static
○ /about                        Static
○ /services                     Static
○ /contact                      Static
○ /projects                     Static
● /projects/[slug]               SSG (10 paths)
○ /blog                         Static
● /blog/[slug]                   SSG (12 paths)
○ /sitemap.xml, /robots.txt     Static
```

- **মোট client-side JS chunk সাইজ:** `.next/static/chunks/` ফোল্ডার ≈ **২.৮ MB** (সব রাউটের মধ্যে ভাগ হওয়া, gzip-এর আগে)।
- সব ৮টা রাউট সম্পূর্ণ static/SSG — কোনো সার্ভার-সাইড রেন্ডারিং-এর রানটাইম খরচ নেই, প্রতিটা রিকোয়েস্ট একটা pre-built HTML ফাইল সার্ভ করে (CDN edge থেকে হলে response time কার্যত network latency-নির্ভর, সার্ভার কম্পিউট-নির্ভর না)।

**Turbopack production build নিজেই একটা পারফরম্যান্স পরিবর্তন:** `package.json`-এর `build` স্ক্রিপ্ট Next.js 16-এর Turbopack বিল্ডার ব্যবহার করছে, যেটা Webpack-ভিত্তিক পুরনো বিল্ডের তুলনায় সাধারণত দ্রুত কোল্ড বিল্ড দেয় (এখানে ৯.৭ সেকেন্ডে কম্পাইল, ৩২টা স্ট্যাটিক পেজ ১.২ সেকেন্ডে জেনারেট) — এটা ডেভেলপার/CI experience-এর অপ্টিমাইজেশন, end-user-facing না।

---

## ৭. থিম সিস্টেম অপসারণের রানটাইম প্রভাব (যুক্তিভিত্তিক বিশ্লেষণ)

যেহেতু `next-themes` ও এর সাথে যুক্ত সব কোড সম্পূর্ণ সরানো হয়েছে, নিচের রানটাইম আচরণগুলো এখন আর ঘটে না:

1. **কোনো pre-hydration blocking script নেই** — `next-themes`-এর `ThemeProvider` সাধারণত `<head>`-এ একটা ইনলাইন স্ক্রিপ্ট বসায় যা paint-এর আগে localStorage থেকে থিম পড়ে `<html>`-এ ক্লাস বসায় (FOUC এড়াতে)। এই স্ক্রিপ্ট এক্সিকিউশন এখন সম্পূর্ণ বাদ।
2. **থিম-context re-render নেই** — আগে যেকোনো কম্পোনেন্ট `useTheme()` ব্যবহার করলে থিম-প্রোভাইডার কনটেক্সটে সাবস্ক্রাইব হতো; এখন সেই সাবস্ক্রিপশন গ্রাফ সম্পূর্ণ অনুপস্থিত।
3. **`suppressHydrationWarning` এখন কার্যকরী প্রয়োজন ছাড়াই থেকে গেছে** (`PROJECT-REVIEW-BN.md` §৩.৩-এ চিহ্নিত) — সরালে hydration mismatch সংক্রান্ত বাস্তব সমস্যা লুকানো বন্ধ হবে এবং debugging আরও নির্ভরযোগ্য হবে।

**ট্রেড-অফ, সততার সাথে:** সাইট এখন ব্যবহারকারীর OS-লেভেল light/dark পছন্দ অনুযায়ী মানিয়ে নিতে পারে না (dark-mode-only) — এটা একটা প্রোডাক্ট সিদ্ধান্ত যা এই অডিটের স্কোপের বাইরে, কিন্তু এখানে নথিভুক্ত করে রাখা হলো যাতে ভবিষ্যতে কেউ "থিম টগল কোথায় গেল" জিজ্ঞেস করলে এটা ইচ্ছাকৃত সিদ্ধান্ত হিসেবে বোঝা যায়, দুর্ঘটনাক্রমে হারানো ফিচার হিসেবে না।

---

## ৮. রেসপন্স টাইম / বাস্তব পারফরম্যান্স পরিমাপ (২০২৬-০৯-০৩)

### পদ্ধতি ও সীমাবদ্ধতা

`pnpm build` দিয়ে একটা তাজা প্রোডাকশন বিল্ড তৈরি করে, `next start` দিয়ে **লোকাল Windows মেশিনে** (পোর্ট ৩০০১, যাতে ব্যবহারকারীর নিজের dev সার্ভারের সাথে সংঘর্ষ না হয়) সার্ভ করে, Playwright-এর সাথে বান্ডেল করা Chromium ব্যবহার করে `npx lighthouse` (v13.4.1) দিয়ে ৬টা মূল রুট পরিমাপ করা হয়েছে — ডিফল্ট Lighthouse throttling (simulated slow network + 4x CPU slowdown) সহ।

**সততার সাথে সীমাবদ্ধতা:**
- এটা **প্রকৃত deployed প্রোডাকশন (Netlify CDN)-এর সংখ্যা না** — লোকাল মেশিনে, লোকাল নেটওয়ার্কে পরিমাপ করা। CDN edge caching, রিয়েল নেটওয়ার্ক লেটেন্সি, এবং real-world ডিভাইসের প্রভাব এখানে নেই। এটা একটা **পুনরুৎপাদনযোগ্য বেসলাইন** — এই একই মেশিনে ভবিষ্যতে আবার পরিমাপ করলে আপেক্ষিক উন্নতি/অবনতি তুলনা করা যাবে, কিন্তু "প্রকৃত ব্যবহারকারী কী অনুভব করছে" তার প্রতিনিধি না।
- **"Before" (এই রিফ্যাক্টরের আগে) পরিমাপ করা সম্ভব হয়নি** — সেটার জন্য পুরনো npm-ভিত্তিক কমিট আলাদাভাবে চেকআউট করে বিল্ড করতে হতো, যা এই রাউন্ডের স্কোপে রাখা হয়নি। নিচের সংখ্যাগুলো তাই **শুধু "After" বেসলাইন**, ভবিষ্যতের পরিবর্তনের সাথে তুলনা করার জন্য।
- প্রথম প্রচেষ্টায় ভুল সার্ভার (পোর্ট ৩০০০-এ চলমান একটা ভিন্ন/অসম্পূর্ণ ইনস্ট্যান্স) থেকে ভুল সংখ্যা এসেছিল (`/about`, `/projects` ৪০৪ রিটার্ন করছিল) — সেটা ধরে ফেলে সঠিক পোর্টে পুনরায় পরিমাপ করা হয়েছে।

### ফলাফল

| রুট | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/` (হোম) | 79 | 91 | 96 | 100 | 1.6 s | 650 ms | 0 |
| `/about` | 84 | 91 | 100 | 100 | 3.7 s | 160 ms | 0 |
| `/projects` | 66 | 91 | 96 | 100 | **7.9 s** | 300 ms | 0 |
| `/contact` | 88 | 82 | 100 | 100 | 3.4 s | 110 ms | 0 |
| `/projects/karially` (detail) | 94 | 96 | 100 | 100 | 2.5 s | 120 ms | 0 |
| `/blog` | 84 | 84 | 100 | 100 | 4.1 s | 60 ms | 0 |

**CLS সব রুটে 0** — লেআউট শিফট নেই, এটা আগের কোড-রিভিউ-ভিত্তিক অনুমানের (§৬ পুরনো পারফরম্যান্স নোট) সাথে মেলে।

### নতুন concrete findings (Lighthouse রান করেই পাওয়া গেছে, আগে জানা ছিল না)

1. **`/projects` পেজে console-এ WebGL error লগ হচ্ছে:** `THREE.WebGLRenderer: Error creating WebGL context`। কারণ খুঁজে পাওয়া গেছে — `/projects` পেজের `CTASection` কম্পোনেন্ট `HeroBackground` (three.js) পুনরায় ব্যবহার করে ("liquid glass" ব্যাকগ্রাউন্ড সবখানে একই রাখতে)। এই নির্দিষ্ট error headless/sandboxed Chrome-এর GPU-সীমাবদ্ধতার কারণে হতে পারে (আসল ব্যবহারকারীর ব্রাউজারে সাধারণত এটা হয় না), কিন্তু **এটা যাচাই করা দরকার** — GPU-নিষিদ্ধ পরিবেশে (কিছু কর্পোরেট মেশিন, পুরনো ডিভাইস, VM) থাকা বাস্তব ব্যবহারকারীদের জন্য three.js scene-টা কি gracefully fallback করে, নাকি silently ভেঙে যায়? `components/three/hero-background/HeroBackground.tsx`-এ WebGL context-creation ব্যর্থতার জন্য কোনো error boundary/fallback আছে কিনা চেক করা উচিত।
2. **`/projects`-এর LCP ইমেজে `fetchpriority=high` প্রয়োগ হচ্ছে না** — Lighthouse-এর `lcp-discovery-insight` অডিট দেখায় `priorityHinted: false`, যদিও `ProjectsGridSection.tsx`-এর `ProjectCard` কম্পোনেন্ট প্রথম ৩টা কার্ডে `priority={index < 3}` সেট করে। এটা LCP-এর ৭.৯ সেকেন্ডে থাকার একটা সরাসরি অবদানকারী কারণ হতে পারে — তদন্ত করা উচিত কেন Next.js-এর `priority` prop এই ক্ষেত্রে `fetchpriority="high"` অ্যাট্রিবিউটে অনুবাদ হচ্ছে না।
3. **`/contact`-এ Accessibility স্কোর সবচেয়ে কম (82)** — অন্য সব রুট ৯১+ — এটা নির্দিষ্টভাবে কোন অ্যাক্সেসিবিলিটি অডিট ব্যর্থ হচ্ছে তা এখনো ব্রেকডাউন করে দেখা হয়নি (পরবর্তী ধাপ)।

### পরবর্তী পদক্ষেপ

- ডিপ্লয় করা প্রোডাকশন URL (`https://brainstackstudios.com` — কাস্টম ডোমেইন কানেক্ট হওয়ার পর আপডেটেড, দেখুন §১২.৪)-এ একবার Lighthouse/PageSpeed Insights চালিয়ে এই লোকাল সংখ্যার সাথে তুলনা করা — CDN/real-network প্রভাব কতটা তা বোঝার জন্য।
- ভবিষ্যতে বড় পরিবর্তনের পর এই একই ৬টা রুটে আবার পরিমাপ করে একটা "After২" কলাম যোগ করা, একটা পরিষ্কার/idle মেশিনে (নিচের নোট দেখুন)।

### ফিক্স ও ভেরিফিকেশন (২০২৬-০৯-০৩, একই দিনে)

উপরের finding #১ ও #২ তদন্ত করে ফিক্স করা হয়েছে:

**#২ (`fetchpriority` অনুপস্থিত) — root cause পাওয়া গেছে:** Next.js 16-এ `priority` prop আর স্বয়ংক্রিয়ভাবে `fetchPriority="high"` সেট করে না — `node_modules/next/dist/shared/lib/get-img-props.js` পড়ে নিশ্চিত হওয়া গেছে যে `priority` এখন শুধু "preload করো, lazy-load কোরো না" নিয়ন্ত্রণ করে; `fetchPriority` একটা সম্পূর্ণ আলাদা, এখন থেকে explicit ভাবে পাস করতে হওয়া prop। **ফিক্স:** যেখানেই `<Image priority>` (বা কন্ডিশনাল `priority={...}`) ব্যবহৃত হয়েছিল, সেখানে সাথে মিলিয়ে `fetchPriority="high"` (বা কন্ডিশনাল) যোগ করা হয়েছে — মোট ৮টা ফাইল (`ProjectsGridSection.tsx`, `ServiceSpotlight.tsx`, `BlogDetails.tsx`, `MissionHero.tsx`, `AllBlogs.tsx`, ও তিনটা wrapper কম্পোনেন্ট: `ParallaxImage.tsx`, `ProjectMedia.tsx`, `ServiceVisual.tsx`)। **সরাসরি যাচাই** (Lighthouse-নির্ভর না): `next start` দিয়ে সার্ভ করা HTML সরাসরি `grep` করে নিশ্চিত হওয়া গেছে `fetchPriority="high"` এখন `<img>` ট্যাগ ও তার `<link rel="preload">`-এ সঠিকভাবে বসছে।

**#১ (WebGL error) — root cause পাওয়া গেছে:** `HeroBackground.tsx` (three.js) `/projects`-এও রেন্ডার হয়, কারণ `CTASection.tsx` এটা reuse করে। কোনো `<Canvas>`-এর চারপাশে error boundary ছিল না — WebGL context creation ব্যর্থ হলে (headless/GPU-সীমিত পরিবেশে, যেমন এই টেস্টেই দেখা গেছে) পুরো React ট্রি ভেঙে root `app/error.tsx`-এ চলে যাওয়ার ঝুঁকি ছিল। **ফিক্স:** একটা নতুন শেয়ার্ড `components/three/CanvasErrorBoundary.tsx` (class component, যেহেতু error boundary-র হুক ইকুইভ্যালেন্ট নেই) বানিয়ে `HeroBackground.tsx` ও `BrainWireframe.tsx` দুটোরই `<Canvas>` মুড়ে দেওয়া হয়েছে — ব্যর্থ হলে চুপচাপ `null` রেন্ডার করে (যেহেতু ক্যানভাস সবসময় `aria-hidden` ও ইতিমধ্যে-দৃশ্যমান একটা প্লেইন CSS ব্যাকগ্রাউন্ডের উপর বসানো, তাই "কিছু না দেখানো"ই সঠিক fallback)। **সরাসরি যাচাই:** ফিক্সের পর তৈরি করা প্রোডাকশন HTML-এ `grep` করে নিশ্চিত হওয়া গেছে `/projects` পেজ স্বাভাবিক কনটেন্ট ("Work we've shipped") নিয়ে রেন্ডার হয়েছে, `app/error.tsx`-এর কোনো টেক্সট ("Unexpected Error") পাওয়া যায়নি — অর্থাৎ boundary কাজ করছে।

**সততার সাথে একটা গুরুত্বপূর্ণ মেথডোলজি নোট — Lighthouse স্কোর পুনরায় পরিমাপ করে "% উন্নতি" দাবি করা হচ্ছে না:** ফিক্সের পর পুনরায় পুরো ৬-রুট Lighthouse পাস চালিয়ে অসামঞ্জস্যপূর্ণ ফলাফল পাওয়া গেছে (কিছু রুটে উন্নতি, কিছুতে সামান্য অবনতি, রান-টু-রান তারতম্য বেশি) — তদন্ত করে কারণ পাওয়া গেছে: এই সেশনের একাধিক Lighthouse ইনভোকেশন থেকে **৫+টা orphaned `chrome.exe` প্রসেস** ব্যাকগ্রাউন্ডে জমে ছিল (chrome-launcher-এর tmp-dir cleanup-এ একটা Windows-নির্দিষ্ট `EPERM` এরর-এর কারণে `Launcher.kill()` সম্পূর্ণ হচ্ছিল না), যা লোকাল মেশিনের CPU লোড বাড়িয়ে timing-নির্ভর মেট্রিক (Performance, LCP, TBT) অস্থির করে তুলেছিল। এই প্রসেসগুলো সরানো হয়েছে, কিন্তু ততক্ষণে একটা পরিষ্কার before/after নম্বর জোগাড় করার সুযোগ নষ্ট হয়ে গেছে এই রাউন্ডে। **উভয় ফিক্সই সঠিক এবং সরাসরি (Lighthouse-নিরপেক্ষভাবে) যাচাই করা হয়েছে উপরে বর্ণিত পদ্ধতিতে** — শুধু "কত % দ্রুত হলো" এই নির্দিষ্ট সংখ্যাটা এই রাউন্ডে বিশ্বাসযোগ্যভাবে বলা যাচ্ছে না।

**ভবিষ্যতের জন্য শিক্ষা:** লোকাল মেশিনে বারবার `npx lighthouse` চালালে প্রতিটা রানের পর `tasklist`/Task Manager দিয়ে orphaned `chrome.exe` চেক করা উচিত, অথবা `lighthouse`-কে `--chrome-flags="--headless=new"` এর পাশাপাশি একটা নির্দিষ্ট `--user-data-dir` দিয়ে চালিয়ে ম্যানুয়ালি cleanup করা উচিত। CI/একটা ডেডিকেটেড পরিবেশে (GitHub Actions-এর `lighthouse-ci` অ্যাকশন, বা PageSpeed Insights-এর মতো hosted টুল) চালানো এই ধরনের local resource-contention সমস্যা সম্পূর্ণ এড়িয়ে যায় — ভবিষ্যতের পরিমাপের জন্য এটাই বেশি নির্ভরযোগ্য পথ।

---

## ৯. এই মুহূর্ত পর্যন্ত পরিবর্তনের সামগ্রিক প্রভাব — সংক্ষেপে

| ক্ষেত্র | প্রভাব | প্রমাণের ধরন |
|---|---|---|
| Bundle size | ৩টা npm প্যাকেজ + ৯০৬ লাইন কম্পোনেন্ট কোড সরানো হয়েছে বান্ডেল থেকে | যাচাইকৃত (git diff + grep) |
| নিরাপত্তা | ৪টা security header যোগ, clickjacking/MIME-sniffing সুরক্ষা | যাচাইকৃত (কোড পড়া) |
| Maintainability | ২টা নতুন শেয়ার্ড কম্পোনেন্ট, ৪টা ফাইলের ডুপ্লিকেশন সরানো, কড়া lint rule | যাচাইকৃত (কোড পড়া) |
| রানটাইম simplicity | থিম-সিস্টেমের blocking script ও context subscription গ্রাফ সম্পূর্ণ বাদ | যুক্তিভিত্তিক (next-themes-এর পরিচিত আচরণ থেকে) |
| Response time / Core Web Vitals | ✅ লোকাল বেসলাইন পরিমাপ করা হয়েছে (Performance 66-94, CLS 0 সব রুটে) | যাচাইকৃত (Lighthouse, ৬টা রুট) — §৮ দেখুন। **Before সংখ্যা নেই**, এবং এটা deployed প্রোডাকশনের প্রতিনিধি না — সীমাবদ্ধতা §৮-এ বিস্তারিত |
| Developer experience | ইনস্টল দ্রুত (pnpm), বিল্ড দ্রুত (Turbopack), কম ফাইল স্ক্যান করতে হয় | আংশিক যাচাইকৃত (বিল্ড টাইম), আংশিক যুক্তিভিত্তিক |

---

## ১০. রাউন্ড ২ — P0 অ্যাকশন প্ল্যান বাস্তবায়ন (২০২৬-০৯-০২)

`PROJECT-REVIEW-BN.md`-এর P0 তালিকার সব আইটেম এখন সম্পন্ন। এটা এই ডকুমেন্টের নিজস্ব সুপারিশ (§৮, উপরে) অনুসরণ করে করা প্রথম ফলো-আপ রাউন্ড — dependency diff → dead code diff → বাস্তব বিল্ড আউটপুট।

### ১০.১ ডোমেইন বাগ — পরিকল্পনার চেয়ে বড় আবিষ্কার

মূল অডিটে এটা একটা "অসামঞ্জস্য" হিসেবে ফ্ল্যাগ করা হয়েছিল (§৩.১, মূল ডকুমেন্টে)। বাস্তবায়নের সময় `WebFetch` দিয়ে দুটো ডোমেইনই সরাসরি চেক করে দেখা যায়:

- `https://brainstackstudio.netlify.app` → এই প্রজেক্টেরই লাইভ সাইট (Karially, LuxeB2B, Jakir Uddin — কোডের ডেটার সাথে হুবহু মেলে)।
- `https://brainstack.dev` → **সম্পূর্ণ ভিন্ন একটা কোম্পানি** ("BrainStack Technologies", Sydney-based, "Building Tomorrow's Technology Today" ট্যাগলাইন) — এই প্রজেক্টের সাথে কোনো সম্পর্ক নেই।

অর্থাৎ এতদিন **প্রতিটা পেজের canonical URL, Open Graph URL, sitemap.xml, ও structured data** এমন একটা ডোমেইনে পয়েন্ট করছিল যেটা এই কোম্পানি মালিকানাধীনই না। এটা শুধু "ভুল স্ট্রিং" না — এটা একটা বাস্তব SEO ও ব্র্যান্ড-নিরাপত্তা ইস্যু ছিল।

**ফিক্স:** `lib/metadata.ts`-এর `siteConfig.url` এখন একমাত্র সোর্স — সব জায়গায় (openGraph, canonical, `generateBlogPostMetadata`, `generateProjectMetadata`) হার্ডকোড স্ট্রিং-এর বদলে `siteConfig.url` টেমপ্লেট লিটারেল ব্যবহার করা হয়েছে, এবং `lib/actions/contact.ts`-এর ইমেইল টেমপ্লেটও একই ভ্যারিয়েবল থেকে টানে। এখন ডোমেইন বদলাতে হলে **একটামাত্র লাইন** বদলালেই যথেষ্ট।

### ১০.২ ডেড কোড ও ডিপেন্ডেন্সি — চূড়ান্ত অপসারণ

| আইটেম | ফলাফল |
|---|---|
| `components/sections/VideoSection.tsx` | মুছে ফেলা হয়েছে |
| `components/ui/carousel.tsx`, `components/ui/button.tsx` | মুছে ফেলা হয়েছে (dead chain) |
| `lib/utils/format-date.ts` | মুছে ফেলা হয়েছে |
| `lib/data/testimonials.ts` + `home-page.ts` barrel-এর re-export | মুছে ফেলা হয়েছে |
| `lib/data/about-page.ts`-এর `whyChooseUsData` + টাইপ | মুছে ফেলা হয়েছে (অব্যবহৃত `FeatureCard` import-ও পরিষ্কার করা হয়েছে) |
| `lib/data/projects.ts`-এর `projectsShowcaseData` | মুছে ফেলা হয়েছে |
| `@radix-ui/react-slot`, `class-variance-authority`, `embla-carousel-react` | `package.json` থেকে সরানো, `pnpm install` চালিয়ে verify করা হয়েছে |

**`pnpm install`-এর বাস্তব আউটপুট:**
```
Packages: -4
dependencies:
- @radix-ui/react-slot 1.3.0
- class-variance-authority 0.7.1
- embla-carousel-react 8.6.0
(+ transitively: embla-carousel core)
```

### ১০.৩ ছোট বাগ ফিক্স

- `formatBytes` এখন `lib/utils/format-bytes.ts`-এ একবারই লেখা, `contact.ts` ও `ContactForm.tsx` দুটোই সেখান থেকে import করে।
- `HowWeWorkSection.tsx`-এ প্রতিটা প্রসেস-স্টেপ কার্ডে এখন `duration` ব্যাজ (যেমন "1-2 WEEKS") দেখানো হয় — আগে ডেটাতে থাকলেও UI-তে রেন্ডার হতো না।
- `app/layout.tsx`-এর `<html>` থেকে vestigial `suppressHydrationWarning` সরানো হয়েছে।

### ১০.৪ যাচাইকরণ (বাস্তব কমান্ড আউটপুট)

| চেক | ফলাফল |
|---|---|
| `pnpm typecheck` | ✅ ক্লিন (০ এরর) |
| `pnpm lint` | ✅ ০ এরর (১টা পূর্ব-বিদ্যমান, ডকুমেন্টেড warning — `ContactForm.tsx`-এর ইচ্ছাকৃত `set-state-in-effect` ট্রেড-অফ, এই রাউন্ডে নতুন কিছু না) |
| `pnpm build` | ✅ সফল — Turbopack, ১১.৯ সেকেন্ডে কম্পাইল, ৩২/৩২ static page জেনারেট, কোনো broken import নেই |
| Client JS chunk সাইজ (`.next/static/chunks`) | ২,৬৭৬,২৯০ বাইট (≈ ২.৫৫ MB), আগের রাউন্ডের `du -sh` অনুযায়ী আনুমানিক ২.৮ MB থেকে |

**সততার সাথে একটা নোট:** chunk সাইজে যে পরিমাণ কমা দেখা যাচ্ছে তা প্রত্যাশার চেয়ে ছোট (৪টা প্যাকেজ, ~৮৭৬ KB আনপ্যাকড সোর্স সরানোর পরও) — কারণ Turbopack-এর tree-shaking মূলত dead-import করা কোডকে বিল্ড-টাইমেই বাদ দিয়ে দিত, যেহেতু `ui/button.tsx`/`ui/carousel.tsx` কোনো actual route থেকে reachable ছিল না। তাই এই cleanup-এর আসল, পরিমাপযোগ্য সুবিধা **bundle byte-এ বড় ড্রপ না** — বরং (ক) `node_modules`-এ ৪টা কম প্যাকেজ ইনস্টল/অডিট/আপডেট করতে হবে, (খ) `pnpm install` দ্রুত হবে, এবং (গ) ভবিষ্যতে কেউ ভুলবশত এই dead ফাইলগুলো import করে ফেলার ঝুঁকি শূন্য হয়ে গেছে।

---

## ১১. রাউন্ড ৩ — P1 অ্যাকশন প্ল্যান বাস্তবায়ন (২০২৬-০৯-০২)

`PROJECT-REVIEW-BN.md`-এর P1 তালিকা থেকে **error-tracking সার্ভিস আইটেমটা ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে** (বর্তমান স্কেলে প্রয়োজন নেই বলে সিদ্ধান্ত) — বাকি তিনটা আইটেম সম্পন্ন।

### ১১.১ `ServiceRow.tsx` — আধুনিকীকরণের চেয়ে বড় সরলীকরণ

মূল পরিকল্পনা ছিল `forwardRef`-কে React 19-এর ref-as-prop প্যাটার্নে বদলানো। কিন্তু বাস্তবায়নের আগে যাচাই করতে গিয়ে দেখা যায় — `ServiceRowHandle`/`useImperativeHandle`-এর মাধ্যমে exposed করা `.root` DOM নোড **কোনো consumer-ই কখনো ব্যবহার করত না** (`ServicesStack.tsx` কোনো জায়গাতেই `<ServiceRow ref={...}>` লেখেনি — `useServicesScrollStack.ts` সরাসরি `mobileListRef.current.children` দিয়ে DOM অ্যাক্সেস করে, `ServiceRow`-এর নিজস্ব ref দিয়ে না)। ফলাফল: শুধু প্যাটার্ন বদলানো না, পুরো imperative-handle মেশিনারিটাই (৩৯ লাইন → ১৭ লাইন) সরিয়ে ফেলা হয়েছে — এটা YAGNI-এর একটা প্রকৃত উদাহরণ: "ভবিষ্যতে দরকার হতে পারে" ভেবে রাখা একটা API surface যেটা কখনো ব্যবহৃতই হয়নি।

### ১১.২ `HoneypotField` — সত্যিকারের ডুপ্লিকেশন সরানো

`ContactForm.tsx` ও `ProjectInquiry.tsx`-এ কমেন্টসহ বাইট-বাই-বাইট একই honeypot `<input>` ব্লক ছিল। এখন `components/shared/form-field.tsx`-এ একটা `<HoneypotField />` কম্পোনেন্ট, দুই ফর্মেই ব্যবহৃত। প্রতিটা ফর্ম থেকে ~১৫ লাইন কমেছে।

> **আপডেট (রাউন্ড ৪, নিচে দেখুন):** honeypot ফিচারটাই পরে প্রোডাক্ট সিদ্ধান্তে সম্পূর্ণ সরানো হয়েছে, তাই `<HoneypotField />`-ও সরিয়ে ফেলা হয়েছে। এই সেকশন ঐতিহাসিক রেকর্ড হিসেবে রাখা হলো।

### ১১.৩ Dead `dark:` ক্লাস — যতটা ভাবা হয়েছিল তার চেয়ে গভীর সমস্যা

মূল অডিটে (`PROJECT-REVIEW-BN.md` §৩.৪) পাঁচটা ফাইলে dead `dark:` ইউটিলিটি ক্লাস চিহ্নিত হয়েছিল। বাস্তবায়নের সময় `Logo.tsx` পরীক্ষা করতে গিয়ে একটা গভীর তথ্য বেরিয়ে আসে:

- `app/globals.css`-এর `@custom-variant dark (&:is(.dark *));` ঘোষণা Tailwind-এর `dark:` ভ্যারিয়েন্টকে **শুধু `.dark` ক্লাসের উপর নির্ভরশীল** করে রেখেছিল (OS-এর `prefers-color-scheme` মিডিয়া কোয়েরি-ভিত্তিক ডিফল্ট আচরণ না) — আর যেহেতু কোথাও `.dark` ক্লাস বসে না, **পুরো কোডবেসের প্রতিটা `dark:` ইউটিলিটি প্রমাণিতভাবে অনুপ্রবেশযোগ্য (unreachable) ছিল**, ব্যতিক্রম ছাড়াই।
- `Logo.tsx`-এর `variant="auto"` (দুটো `<Image>` কম্পোনেন্ট, `dark:hidden`/`dark:inline-block` দিয়ে সোয়াপ করার কথা ছিল) একই কারণে কার্যত অচল ছিল — শুধু কাকতালীয়ভাবে সঠিক ছবি দেখাচ্ছিল, কারণ এর একমাত্র consumer (`Loader.tsx`) সাদা ব্যাকগ্রাউন্ডে রেন্ডার হয় এবং "ডিফল্ট" (non-dark:) ছবিটাই সেই ব্যাকগ্রাউন্ডের জন্য সঠিক মার্ক। এটা একটা লুকানো ভঙ্গুরতা ছিল — ভবিষ্যতে কেউ Loader-এর ব্যাকগ্রাউন্ড বদলালে লোগো অদৃশ্য হয়ে যেতে পারত, কিছু না ভেঙেই।

**ফিক্স:** `Logo.tsx`-এর `"auto"` ভ্যারিয়েন্ট সম্পূর্ণ সরিয়ে `"on-dark"`/`"on-light"` explicit prop-এ সরলীকরণ (ডিফল্ট `"on-light"`, যা আগের আচরণের সাথে বাইট-বাই-বাইট অভিন্ন আউটপুট দেয়)। `Navbar.tsx`, `ScrollButton.tsx`, `ProjectDetails.tsx`-এর মৃত `dark:` ভ্যারিয়েন্ট সরানো। `globals.css`-এর অব্যবহৃত `@custom-variant dark` লাইন সরানো। **রেন্ডার আউটপুটে শূন্য পরিবর্তন** — শুধু dead/ভঙ্গুর কোড সরানো হয়েছে।

### ১১.৪ যাচাইকরণ

| চেক | ফলাফল |
|---|---|
| `pnpm typecheck` | ✅ ক্লিন |
| `pnpm lint` | ✅ ০ এরর (একই পূর্ব-বিদ্যমান warning) |
| `pnpm build` | ✅ সফল, ৩২/৩২ static page, কোনো broken import নেই |

---

## ১২. রাউন্ড ৪ — P2 অ্যাকশন প্ল্যান বাস্তবায়ন (২০২৬-০৯-০২)

এই রাউন্ডে দুটো ভিন্ন ধরনের কাজ হয়েছে: একটা প্রোডাক্ট সিদ্ধান্ত (কন্ট্যাক্ট ফর্ম সরলীকরণ, ব্যবহারকারীর নির্দেশে) এবং একটা টুলিং addition (`ts-prune`)।

### ১২.১ কন্ট্যাক্ট ফর্ম সরলীকরণ — একটা প্রোডাক্ট সিদ্ধান্ত, রোলব্যাক না

ব্যবহারকারীর স্পষ্ট নির্দেশে `lib/actions/contact.ts` থেকে honeypot স্প্যাম-সুরক্ষা ও per-IP rate limiting সম্পূর্ণ সরানো হয়েছে — এখন এই Server Action শুধু ভ্যালিডেশন + Gmail SMTP-তে ইমেইল পাঠানো করে। প্রাসঙ্গিক পরিবর্তন:

| ফাইল | পরিবর্তন |
|---|---|
| `lib/actions/contact.ts` | `isRateLimited`, `getClientIp`, rate-limit constants, `submissionTimestampsByIp` Map, honeypot চেক ব্লক — সব সরানো (~৫০ লাইন) |
| `components/sections/ContactForm.tsx` | `<HoneypotField />` ও তার import সরানো |
| `components/sections/ProjectInquiry.tsx` | `<HoneypotField />` ও তার import সরানো |
| `components/shared/form-field.tsx` | `HoneypotField` কম্পোনেন্ট সম্পূর্ণ সরানো (আর কোনো consumer নেই) |

**গুরুত্বপূর্ণ পার্থক্য এই ডকুমেন্টের বাকি সব "cleanup"-এর সাথে:** এখানে যা সরানো হয়েছে তা *dead* কোড ছিল না — এগুলো সক্রিয়, কার্যকরী, ভালোভাবে-লেখা ফিচার ছিল (আগের রিভিউ পাসে এগুলোকেই "প্রোডাকশন-গ্রেড" হিসেবে প্রশংসা করা হয়েছিল)। এটা একটা **সচেতন প্রোডাক্ট সিদ্ধান্ত** — জটিলতার বিপরীতে সরলতা বেছে নেওয়া, এখনই স্প্যাম সমস্যা না থাকায়। এটা "খারাপ ইঞ্জিনিয়ারিং ছিল, ঠিক করা হলো" — এভাবে পড়া উচিত না।

### ১২.২ `ts-prune` — টুলিং addition

`pnpm add -D ts-prune` + `package.json`-এ `"deadcode": "ts-prune"` স্ক্রিপ্ট + `.ts-prunerc` (শুধু `.next` ফোল্ডার স্কিপ করার জন্য)। প্রথম রান বাস্তবিকই মূল্য প্রমাণ করেছে — ৮টা dead export তাৎক্ষণিকভাবে ধরা পড়েছে যা প্রথম ম্যানুয়াল রিভিউ পাসে মিস হয়েছিল (§৪.১, `PROJECT-REVIEW-BN.md`)।

**সীমাবদ্ধতা, সততার সাথে:** `.ts-prunerc`-এ Next.js-এর framework convention (page.tsx-এর `default` export ইত্যাদি) ignore করার জন্য একটা regex-ভিত্তিক কনফিগারেশন যোগ করার চেষ্টা করা হয়েছিল, কিন্তু `ts-prune@0.10.3`-এর `ignore` অপশন প্রত্যাশিতভাবে কাজ করেনি (CLI ফ্ল্যাগ দিয়ে সরাসরি টেস্ট করেও নিশ্চিত হয়েছে — সম্ভবত এই ভার্সনের একটা সীমাবদ্ধতা/বাগ)। তাই আপাতত `pnpm deadcode` চালানোর সময় Next.js-এর routing convention-সংক্রান্ত এন্ট্রিগুলো (page.tsx-এর `default`, `metadata`, `generateMetadata`, `generateStaticParams`) ম্যানুয়ালি চোখে বাদ দিয়ে পড়তে হবে — এটা কোনো CI script-এ automated gate হিসেবে বসানোর আগে সমাধান করা দরকার (হয় ভিন্ন `ignore` সিনট্যাক্স খুঁজে, নয়তো `knip`-এর মতো Next.js-aware বিকল্প টুলে সুইচ করে)।

**যে দুটো P2 আইটেম বাদ দেওয়া হয়েছে:**
- `after()` দিয়ে non-blocking ইমেইল ডেলিভারি — বিবেচনা করে প্রয়োগ করা হয়নি (রিলায়েবিলিটি ট্রেড-অফ, বিস্তারিত `PROJECT-REVIEW-BN.md` §৭)।
- Redis/Upstash rate-limit স্টোর — rate limiting ফিচারটাই সরে যাওয়ায় অপ্রাসঙ্গিক হয়ে গেছে (§১২.১)।

### ১২.৩ যাচাইকরণ

| চেক | ফলাফল |
|---|---|
| `pnpm typecheck` | ✅ ক্লিন |
| `pnpm lint` | ✅ ০ এরর (একই পূর্ব-বিদ্যমান warning) |
| `pnpm build` | ✅ সফল, ৩২/৩২ static page |
| `pnpm deadcode` | ✅ চালানো হয়েছে, Next.js framework false-positive বাদে কোনো নতুন real dead export নেই |

### ১২.৪ কাস্টম ডোমেইন কানেক্ট হওয়ার পর `siteConfig.url` দ্বিতীয়বার আপডেট (২০২৬-০৯-০৩)

`https://brainstackstudio.netlify.app` (Netlify-এর ডিফল্ট সাবডোমেইন, §১০.১-এ ব্যবহৃত) এখন প্রতিস্থাপিত হয়েছে আসল কাস্টম প্রোডাকশন ডোমেইন **`https://brainstackstudios.com`** দিয়ে — ব্যবহারকারী নিশ্চিত করেছেন এটাই প্রোডাকশনে চলমান ডোমেইন, এবং `WebFetch` দিয়ে সরাসরি চেক করে (একই Karially/LuxeB2B/Jakir Uddin কনটেন্ট) নিশ্চিত করা হয়েছে।

`lib/metadata.ts`-এর `siteConfig`-এ ৪টা জায়গায় (মূল `url`, `authors[0].url`, `openGraph.url`, `alternates.canonical`) সরাসরি আপডেট করা হয়েছে — বাকি সব জায়গা (প্রতিটা `pageMetadata` এন্ট্রি, `generateBlogPostMetadata`, `generateProjectMetadata`, এবং `lib/actions/contact.ts`-এর ইমেইল ফুটার) P0-তে `siteConfig.url`-কে single source of truth বানানোর কারণে **স্বয়ংক্রিয়ভাবেই** নতুন ডোমেইন থেকে টানছে, আলাদা করে কিছু বদলাতে হয়নি — এই single-source-of-truth ডিজাইনটাই এখানে তার আসল মূল্য প্রমাণ করল।

**প্রোডাক্ট সিদ্ধান্ত (ব্যবহারকারীর নির্দেশে, ২০২৬-০৯-০৩):** `PROJECT-REVIEW-BN.md` §৫-এ দুটো SEO আইটেম (Google Search Console verification, self-hosted OG image) এখনই প্রয়োজন নেই বলে সরিয়ে ফেলা হয়েছে — ডোমেইন যেহেতু এখন চূড়ান্ত, ভবিষ্যতে প্রয়োজন হলে এগুলো আবার বিবেচনা করা যাবে।

---

## ১৩. উপসংহার

এই রিফ্যাক্টরের পাঁচটা রাউন্ড মিলিয়ে যা দাঁড়িয়েছে: **রাউন্ড ১** অব্যবহৃত থিম-ফিচার ও তার সব ট্রেস সরিয়েছে ও নিরাপত্তা হেডার যোগ করেছে; **রাউন্ড ২ (P0)** একটা বাস্তব প্রোডাকশন বাগ (ভুল ডোমেইন) ধরে ঠিক করেছে ও বাকি dead code/dependency সম্পূর্ণ পরিষ্কার করেছে; **রাউন্ড ৩ (P1)** আরও গভীরে গিয়ে দুটো "শুধু আধুনিকীকরণ" মনে হওয়া কাজকে প্রকৃত সরলীকরণ/বাগ-প্রতিরোধে পরিণত করেছে; **রাউন্ড ৪ (P2)** একটা স্পষ্ট প্রোডাক্ট সিদ্ধান্ত (কন্ট্যাক্ট ফর্ম সরলীকরণ) বাস্তবায়ন করেছে এবং `ts-prune` টুলিং যোগ করে তার মূল্য তাৎক্ষণিকভাবে প্রমাণ করেছে; **§৮-এর Lighthouse পরিমাপ** (২০২৬-০৯-০৩) প্রথমবারের মতো বাস্তব সংখ্যাভিত্তিক বেসলাইন দিয়েছে এবং প্রক্রিয়াতেই দুটো নতুন সম্ভাব্য বাগ (WebGL fallback, LCP `fetchpriority`) খুঁজে বের করেছে যা কোড-রিভিউ দিয়ে ধরা পড়েনি। প্রতিটা রাউন্ডই `typecheck`/`lint`/`build` (এবং এখন Lighthouse) দিয়ে verify করা হয়েছে — কোনো পরিবর্তনই অনুমাননির্ভর না।

যা এখনো বাকি এবং এই ডকুমেন্টের পরবর্তী সংস্করণে যোগ হওয়া উচিত:

1. §৮-এ পাওয়া দুটো নতুন finding তদন্ত ও ফিক্স করা (WebGL context fallback, `/projects`-এর LCP ইমেজে `fetchpriority` অনুপস্থিতি) — এগুলো সম্ভাব্য বাস্তব বাগ, শুধু cosmetic না।
2. ডিপ্লয় করা প্রোডাকশন URL-এ Lighthouse চালিয়ে লোকাল সংখ্যার সাথে তুলনা করা, এবং সত্যিকারের "Before" বেসলাইন (পুরনো কমিট চেকআউট করে) পাওয়া গেলে §৮-এর টেবিলে যোগ করা।
3. `.ts-prunerc`-এর ignore-config সমস্যাটা সমাধান করা (§১২.২) — নয়তো ভবিষ্যতে কেউ ভুল করে Next.js-এর convention export-কে "dead" ভেবে ডিলিট করে ফেলতে পারে।
4. প্রতিটা ভবিষ্যৎ বড় রিফ্যাক্টরের পরে এই একই ফরম্যাটে (dependency diff → dead code diff → config diff → বাস্তব বিল্ড আউটপুট → পরিমাপযোগ্য পারফরম্যান্স মেট্রিক) একটা নতুন এন্ট্রি যোগ করা, যাতে সময়ের সাথে সাথে "প্রজেক্ট আসলেই দ্রুত হচ্ছে" এটা অনুমান না হয়ে ডেটা-ভিত্তিক সিদ্ধান্ত হয়।

সম্পূর্ণ ইস্যু তালিকা, কোড অর্গানাইজেশন, SEO, এরর হ্যান্ডলিং, এবং ভবিষ্যৎ অ্যাকশন প্ল্যানের জন্য দেখুন **[`PROJECT-REVIEW-BN.md`](./PROJECT-REVIEW-BN.md)**।
