# Brain Stack Studio — Content Update Task
Version: 1.0
Source: Website Content Brief (July 2026)
Status: Ready for Claude Code

---

# Objective

Update the Brain Stack Studio website using the provided content brief.

This is primarily a **content refresh and trust improvement sprint**, not a redesign.

The goal is to improve:

- Trust
- Credibility
- Positioning
- Conversion
- Content quality

while preserving the existing UI/UX, animations, design system, and project architecture.

---

# Important Rules

## DO

✔ Keep the current design language

✔ Keep all GSAP animations

✔ Keep responsive layouts

✔ Keep component structure whenever possible

✔ Reuse existing components

✔ Follow existing coding conventions

✔ Maintain accessibility

✔ Keep spacing and typography consistent

✔ Keep performance unchanged

---

## DO NOT

❌ Don't redesign sections

❌ Don't replace layouts unnecessarily

❌ Don't rename folders

❌ Don't rewrite architecture

❌ Don't remove animations

❌ Don't introduce new dependencies

❌ Don't refactor unrelated code

❌ Don't modify sections not mentioned in this document

---

# Priority Order

Execute tasks in the following order.

---

# P0 — Trust Fixes (Critical)

These directly affect business credibility.

## Task 1

Remove Testimonials section.

Acceptance Criteria

- Entire section removed
- No placeholder testimonials
- Layout spacing remains clean

---

## Task 2

Replace fake office address.

Old

148 Innovation Drive
Suite 400
San Francisco

New

London · New York · Dhaka

Acceptance Criteria

No fake address remains anywhere.

---

## Task 3

Replace phone number.

Old

+1 (415) 555-0182

New

+1 (315) 272-7994

Acceptance Criteria

No fake number exists.

---

## Task 4

Fix Stats section.

Current animated counters begin from 0.

Replace with static values.

Values

5+

Products Shipped

4+

Years Combined Experience

2

Founders

Acceptance Criteria

- Never displays 0
- No loading flicker
- Values visible immediately

---

## Task 5

Audit social links.

Check

- GitHub
- LinkedIn
- X
- Instagram

Acceptance Criteria

If account exists

Keep.

Otherwise

Remove icon completely.

---

# P1 — Homepage Copy Refresh

---

## Hero Section

Replace:

Headline

Subheadline

CTA

Secondary CTA

Keep

- Background 
- Existing layout
- Existing animation

Acceptance Criteria

Content exactly follows content brief.

---

## About Section

Replace

Heading

Description

Keep globe illustration.

Acceptance Criteria

Old copy completely removed.

---

# P2 — New Team Section

Insert

After About

Before Services

Layout

Desktop

Two Cards

Tablet

Two Cards

Mobile

Single Column

Each Card

Photo

(use initials until real images arrive)

Name

Title

Bio

LinkedIn

Skills

Acceptance Criteria

Responsive

Visually consistent

No layout shifts

---

# P3 — Services

Keep

Cards

Icons

Animations

Replace

Heading

Description

Acceptance Criteria

Only copy changes.

---

# P4 — Portfolio

Keep

Cards

Hover effects

Update

Heading

Description

Every project subtitle

Format

Project

Category

Website

Acceptance Criteria

All projects follow same format.

---

# P5 — Process Section

Current

3 Steps

Replace

4 Steps

Order

1 Discovery

2 Design

3 Build

4 Launch

Acceptance Criteria

Correct numbering

Correct order

Responsive layout preserved

---

# P6 — Blog

Replace

Section Label

Heading

Add

Author avatar

Author name

Example

By Jakir Uddin

Acceptance Criteria

Every article has author.

---

# P7 — FAQ

Create entirely new section.

Location

Above Footer

Preferred Component

Accordion

Fallback

Expandable Cards

Questions

- Project Cost
- Why not AI?
- Timeline
- Team
- Startups
- After Launch
- NDA
- Existing Codebase
- Time Zones

Acceptance Criteria

Responsive

Accessible

Keyboard friendly

---

# P8 — Contact

Replace

Heading

Description

Keep

Existing form

Requirements

- Success message
- Email destination

hello@brainstack.dev

Acceptance Criteria

Form still works.

---

# P9 — Footer

Replace

Address

Phone

Copyright

Verify

Social links

Acceptance Criteria

Footer contains no fake information.

---

# Files Likely Impacted

These are expected locations.
Adjust only if project structure differs.

app/

components/

sections/

lib/data/

content/

constants/

Do not move files unless required.

---

# Content Source

Use ONLY the content provided in the Website Content Brief.

Do not invent marketing copy.

Do not generate placeholder names.

Do not shorten content unless required for layout.

---

# Design Constraints

Maintain

- Existing spacing
- Existing border radius
- Existing typography
- Existing color palette
- Existing shadows
- Existing motion

New sections must visually match the rest of the website.

---

# Code Quality

All code must

- pass TypeScript
- pass ESLint
- build successfully
- avoid duplicate code
- reuse existing components

---

# Validation Checklist

## Content

- [ ] Hero updated
- [ ] About updated
- [ ] Team section added
- [ ] Services updated
- [ ] Portfolio updated
- [ ] Process updated
- [ ] Blog updated
- [ ] FAQ added
- [ ] Contact updated
- [ ] Footer updated

---

## Trust

- [ ] Fake testimonials removed
- [ ] Fake address removed
- [ ] Fake phone removed
- [ ] Stats fixed
- [ ] Social links verified

---

## UI

- [ ] Desktop verified
- [ ] Tablet verified
- [ ] Mobile verified

---

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Semantic headings
- [ ] Alt text

---

## Performance

- [ ] No CLS
- [ ] No hydration issues
- [ ] No animation flicker
- [ ] No unnecessary rerenders

---

## Final Verification

Before finishing, verify:

- Production build succeeds
- No TypeScript errors
- No ESLint errors
- No console errors
- No broken links
- No placeholder content
- No fake business information remains

Only mark the task complete after every checklist item passes.

---

# Out of Scope (Do Not Implement)

These belong to a future sprint.

- Individual Case Study pages
- Third Blog Article
- Clutch Profile
- GoodFirms Profile
- Real Testimonials Integration
- CMS Migration
- SEO Expansion beyond requested copy changes

Ignore these tasks for this implementation.