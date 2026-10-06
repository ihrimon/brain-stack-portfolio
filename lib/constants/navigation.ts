export const navigationData = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  // { name: "Blog", href: "/blog" }, // blog temporarily disabled
  { name: "Contact", href: "/contact" },
] as const

// The compact desktop nav pill only surfaces 3 items — the full list above
// still backs the Footer's site map and the SettingsDrawer's full menu.
export const primaryNavigationData = [
  { name: "Projects", href: "/projects" },
  // { name: "Blog", href: "/blog" }, // blog temporarily disabled
  { name: "Contact", href: "/contact" },
] as const

export const mobileNavigationData = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  // { name: "Blog", href: "/blog" }, // blog temporarily disabled
  // About stands in while the blog is off, so the bar stays 2 + Home + 2.
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const
