import type { Testimonial } from "./shared-types"

export interface ProjectChallenge {
  title: string | null
  description: string
  painPoints: string[]
  businessImpact: string[]
}

export interface ProjectSolution {
  title: string
  description: string
  highlights: string[]
}

export interface ProjectWorkflowStep {
  title: string
  description: string
}

export interface ProjectMetrics {
  performance: string
  seo: string
  accessibility: string
  bestPractices: string
}

/**
 * Fields every project has, whether it's a full case study or a lighter
 * portfolio entry. `challenge`/`solution` live here (not on CaseStudyProject)
 * because even "thin" portfolio entries carry a real challenge/solution
 * summary — it's only the *deep-dive* narrative fields below that some
 * projects skip entirely.
 */
export interface BaseProject {
  id: string
  slug: string
  title: string
  shortTitle: string
  category: string
  industry: string
  client: string
  /** Short service line, e.g. "AI Product Design, Web App Development". Portfolio-only projects. */
  service: string | null
  duration: string | null
  /** Year completed, e.g. "2024". Portfolio-only projects. */
  date: string | null
  status: string | null
  liveUrl: string | null

  thumbnail: string
  heroImage: string
  gallery: string[]

  overview: string
  technologies: string[]
  tools: string[]

  challenge: ProjectChallenge
  solution: ProjectSolution
}

/** A portfolio entry without a full engineering-deep-dive write-up. */
export interface PortfolioProject extends BaseProject {
  kind: "portfolio"
}

/** A full case study — every deep-dive narrative field is populated. */
export interface CaseStudyProject extends BaseProject {
  kind: "case-study"
  goals: string[]
  workflow: ProjectWorkflowStep[]
  architecture: string[]
  features: string[]
  uiHighlights: string[]
  developmentProcess: string[]
  challengesFaced: string[]
  solutionsImplemented: string[]
  results: string[]
  metrics: ProjectMetrics
  testimonial: Testimonial
  lessonsLearned: string[]
  nextSteps: string[]
  relatedProjects: string[]
}

/**
 * A project is either a `PortfolioProject` or a `CaseStudyProject` — check
 * `project.kind` to narrow before accessing case-study-only fields (see
 * ProjectDetails.tsx for the pattern). Previously this was one ~34-field
 * interface with every deep-dive field typed as nullable/optional, which
 * let a "thin" project accidentally carry a stray `workflow` entry with no
 * type-level signal that anything was unusual either way.
 */
export type Project = PortfolioProject | CaseStudyProject

export const projectsData = {
  badge: "Featured Work",
  title: "Selected Projects That Reflect Our Expertise",
  description:
    "From AI-powered platforms and SaaS products to luxury marketplaces, real estate solutions, and modern portfolio websites, each project demonstrates our commitment to creating scalable, user-focused, and visually engaging digital experiences.",

  projects: [
    {
      id: "01",
      slug: "standard-insights",
      kind: "case-study",
      title: "Standard Insights",
      shortTitle: "Standard Insights",
      category: "SaaS Platform",
      industry: "Customer Experience & Feedback Analytics",
      client: "Standard Insights",
      service: null,
      technologies: [
        "Next.js",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Redis",
        "BullMQ",
        "OpenAI API",
        "Claude API",
      ],
      tools: ["Docker", "Railway", "AWS S3", "Chart.js", "GitHub Actions", "Postman"],
      duration: "10 weeks",
      date: null,
      status: "Live",
      liveUrl: "https://app.standard-insights.com",

      thumbnail: "https://i.ibb.co.com/vvvWHy2Y/standard-insights-thumbnail.png",
      heroImage: "https://i.ibb.co.com/vvvWHy2Y/standard-insights-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/zKXHWcR/standard-insights-1.png",
        "https://i.ibb.co.com/pBVzX87J/standard-insights-2.png",
        "https://i.ibb.co.com/dsmmJPR0/standard-insights-3.png",
        "https://i.ibb.co.com/Xx5tx7Dj/standard-insights-4.png",
        "https://i.ibb.co.com/ZpCF7kv9/standard-insights-5.png",
        "https://i.ibb.co.com/pvFCgtz8/standard-insights-6.png",
      ],

      overview:
        "Standard Insights is a multi-tenant SaaS platform that takes consumer research from brief to board-ready report — a template-driven survey builder, panel-backed respondent recruitment, and an AI layer that reads open-ended responses to surface themes, sentiment, and auto-generated personas. We built the product end-to-end, from the survey builder and analytics dashboards to the AI insight pipeline that turns raw responses into decision-ready reporting.",

      challenge: {
        title: "Turning scattered feedback into a single source of truth",
        description:
          "Our client's early customers were collecting feedback across spreadsheets, email, and disconnected form tools, with no reliable way to compare results over time or across teams. Anything beyond simple rating averages required manual analysis.",
        painPoints: [
          "No central system to design, distribute, and version surveys",
          "Open-ended answers went unread at scale — no way to summarize sentiment or themes",
          "Every customer's data needed to stay strictly isolated on shared infrastructure",
          "Existing tools couldn't visualize trends across multiple survey waves",
        ],
        businessImpact: [
          "Slow, manual reporting delayed product and CX decisions by weeks",
          "Teams under-used qualitative feedback simply because nobody had time to read it",
          "Lack of trend visibility made it hard to prove the ROI of CX initiatives",
        ],
      },

      goals: [
        "Ship a self-serve survey builder non-technical teams could use unassisted",
        "Automate qualitative analysis with AI so no response goes unread",
        "Guarantee tenant-level data isolation for enterprise customers",
        "Provide real-time analytics dashboards instead of static exports",
        "Keep the platform responsive under high-volume survey campaigns",
      ],

      solution: {
        title: "An AI-native survey and analytics platform, built for scale",
        description:
          "We designed a multi-tenant architecture from day one, then layered a drag-and-drop survey builder, live analytics dashboards, and an AI/RAG pipeline that reads open text responses and generates theme summaries, sentiment scores, and AI personas automatically — with a Strategic Library that indexes every study for cross-study analysis.",
        highlights: [
          "Dynamic, drag-and-drop survey builder with branching logic",
          "AI agents (OpenAI + Claude) for automatic theming and sentiment analysis",
          "AI-generated personas and executive summaries",
          "Real-time analytics dashboards built on Chart.js",
          "Redis + BullMQ worker queues to process AI jobs asynchronously",
          "Role-based admin panel for workspace and team management",
        ],
      },

      workflow: [
        {
          title: "Discovery & data modeling",
          description:
            "Mapped the multi-tenant data model up front, defining tenant boundaries at the database and API layer before any feature work began.",
        },
        {
          title: "Survey builder & core APIs",
          description:
            "Built the drag-and-drop survey builder alongside a versioned REST API so surveys could be edited without breaking live response data.",
        },
        {
          title: "AI insight pipeline",
          description:
            "Integrated OpenAI and Claude behind a queue-based worker system, so long-running text analysis never blocked the main request path.",
        },
        {
          title: "Analytics & admin panel",
          description:
            "Layered real-time dashboards and a role-based admin panel on top of the response data, giving teams both the summary and the detail view.",
        },
        {
          title: "Hardening & launch",
          description:
            "Load-tested the queueing layer, tuned MongoDB indexes for tenant-scoped queries, and rolled out CI/CD for safe, incremental releases.",
        },
      ],

      architecture: [
        "Multi-tenant data isolation enforced at the database and API layer",
        "REST API with rate-limited, versioned endpoints",
        "Redis + BullMQ worker queues for asynchronous AI processing",
        "RAG pipeline over OpenAI/Claude for automated insight generation",
        "MongoDB with tenant-scoped collections and compound indexes",
      ],

      features: [
        "Drag-and-drop survey builder with conditional logic",
        "AI-generated theme and sentiment summaries for open text",
        "AI-generated personas and executive summaries",
        "Real-time analytics dashboards",
        "Role-based admin panel and workspace management",
        "Exportable reports and shareable dashboard links",
      ],

      uiHighlights: [
        "Distraction-free survey editor with live preview",
        "Chart.js dashboards with drill-down filtering by segment",
        "Dark-mode-first design system built for long analysis sessions",
      ],

      developmentProcess: [
        "Discovery",
        "Research",
        "Planning",
        "Wireframing",
        "UI Design",
        "Development",
        "Testing",
        "Deployment",
        "Optimization",
      ],

      challengesFaced: [
        "Enforcing strict tenant data isolation without duplicating infrastructure per customer",
        "Keeping the UI responsive while AI analysis jobs ran in the background",
        "Designing survey logic flexible enough for branching without overwhelming non-technical users",
        "Optimizing MongoDB queries as response volume scaled into the millions",
      ],

      solutionsImplemented: [
        "Tenant ID scoping enforced at the schema and middleware level, verified with automated tests",
        "Moved all AI calls to BullMQ background workers with progress events streamed to the client",
        "Built a visual branching editor with guardrails that prevent invalid logic states",
        "Introduced compound indexes and query pagination, cutting dashboard load times significantly",
      ],

      results: [
        "Cut manual feedback analysis time from days to minutes",
        "AI theming surfaced actionable insight from 100% of open-ended responses",
        "Dashboard load times stayed under 1s even for multi-thousand-response surveys",
        "Zero cross-tenant data incidents since launch",
      ],

      metrics: {
        performance: "96/100",
        seo: "94/100",
        accessibility: "97/100",
        bestPractices: "100/100",
      },

      testimonial: {
        name: "Ariana Cole",
        role: "Head of Product",
        company: "Standard Insights",
        quote:
          "Brain Stack didn't just build a survey tool — they built the AI layer that makes our customers' feedback actually usable. The multi-tenant architecture has scaled without a single hiccup.",
        image: "/images/testimonials/customer-1.webp",
      },

      lessonsLearned: [
        "Designing tenant isolation at the schema level from day one avoids expensive retrofits later",
        "Queue-based AI processing keeps the UX fast even when the underlying models are slow",
        "Investing early in indexing strategy pays off disproportionately at scale",
      ],

      nextSteps: [
        "Add predictive churn scoring on top of existing sentiment data",
        "Expand AI theming to support multi-language survey responses",
        "Introduce native Slack and email digest integrations",
      ],

      relatedProjects: ["focus-pilot", "career-dock"],
    },

    {
      id: "02",
      slug: "sync-space",
      kind: "case-study",
      title: "SyncSpace",
      shortTitle: "SyncSpace",
      category: "Browser Extension",
      industry: "Productivity Tools",
      client: "SyncSpace",
      service: null,
      technologies: ["Next.js", "TypeScript", "WXT", "Supabase", "ShadCN UI"],
      tools: ["Chrome Extension APIs", "Supabase Realtime", "Vercel", "ESLint"],
      duration: "7 weeks",
      date: null,
      status: "Live",
      liveUrl: "https://syncspace-web.vercel.app",

      thumbnail: "https://i.ibb.co.com/q37Gzwx4/sync-space-thumbnail.png",
      heroImage: "https://i.ibb.co.com/q37Gzwx4/sync-space-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/h1m2j0qx/sync-space-1-1.png",
        "https://i.ibb.co.com/JwzF0N37/sync-space-2-1.png",
        "https://i.ibb.co.com/Lz8Cc2b1/sync-space-3.png",
        "https://i.ibb.co.com/27P70ks5/sync-space-4.png",
        "https://i.ibb.co.com/3HHCYW1/sync-space-5.png",
        "https://i.ibb.co.com/cK377KLv/sync-space-6.png",
      ],

      overview:
        "SyncSpace is a browser extension that keeps bookmarks, tab groups, and extension profiles in sync across every device a user works from. We built it as an offline-first system so browsing organization never breaks, even on a flaky connection.",

      challenge: {
        title: "Bookmarks that fall out of sync the moment you switch devices",
        description:
          "Power users routinely work across three or more machines, but browser-native bookmark sync is unreliable, slow, and prone to silently overwriting changes when multiple devices edit the same folder offline.",
        painPoints: [
          "Bookmark and tab-group state drifted between devices with no conflict resolution",
          "No offline support — sync simply failed without a live connection",
          "Direct, unbatched writes to the sync backend caused excessive network overhead",
          "Deep browser API integration required careful permission and security handling",
        ],
        businessImpact: [
          "Users lost trust in the extension after experiencing overwritten bookmark folders",
          "High network chatter increased backend costs and battery drain on laptops",
        ],
      },

      goals: [
        "Guarantee bookmark and tab-group consistency across unlimited devices",
        "Make sync resilient to offline and intermittent connections",
        "Reduce network overhead from constant small sync writes",
        "Keep the extension lightweight with no visible sync delay",
      ],

      solution: {
        title: "An offline-first sync engine with real conflict resolution",
        description:
          "We rebuilt sync around a local-first queue: every change is written locally first, then reconciled against the server using a hierarchical tree-merge algorithm designed specifically for nested bookmark structures.",
        highlights: [
          "Offline-first sync queue with local storage caching and exponential backoff",
          "Hierarchical tree-reconciliation algorithm for multi-device bookmark merges",
          "Rate-limited, batched Supabase transactions to cut network overhead",
          "Deep integration with chrome.bookmarks, chrome.tabGroups, and chrome.management APIs",
        ],
      },

      workflow: [
        {
          title: "Browser API audit",
          description:
            "Mapped every bookmark, tab-group, and extension-management API needed, along with the permission model required to use them safely.",
        },
        {
          title: "Offline queue design",
          description:
            "Built the local-first write queue and retry-with-backoff logic before touching the sync backend, so the extension worked fully offline from the start.",
        },
        {
          title: "Merge algorithm",
          description:
            "Designed and tested a tree-reconciliation algorithm against real-world conflict scenarios — simultaneous edits, deletions, and folder moves across devices.",
        },
        {
          title: "Backend + batching",
          description:
            "Connected the queue to Supabase with transaction batching and rate limiting to minimize round trips.",
        },
        {
          title: "Cross-browser QA",
          description:
            "Validated behavior across Chrome, Edge, and Brave, then shipped to the Web Store with staged rollout.",
        },
      ],

      architecture: [
        "Local-first write queue backed by browser storage",
        "Hierarchical tree-reconciliation engine for structural merges",
        "Supabase Postgres with row-level security per user",
        "Batched, rate-limited sync transactions",
        "Exponential backoff retry layer for unreliable connections",
      ],

      features: [
        "Real-time bookmark and tab-group sync across devices",
        "Full offline support with automatic catch-up sync",
        "Conflict-free folder merges, even with simultaneous edits",
        "Extension profile sync alongside bookmarks and tabs",
        "Freemium plan (2 devices, 500 bookmarks, manual sync) with a $4.99/mo Pro tier for unlimited auto-sync",
      ],

      uiHighlights: [
        "Native-feeling popup UI built with ShadCN components",
        "Visual sync-status indicator with per-device activity log",
        "Zero-config onboarding — sync starts on install",
      ],

      developmentProcess: [
        "Discovery",
        "Research",
        "Planning",
        "Wireframing",
        "UI Design",
        "Development",
        "Testing",
        "Deployment",
        "Optimization",
      ],

      challengesFaced: [
        "Resolving simultaneous edits to the same bookmark folder from two offline devices",
        "Working within strict browser extension security and permission constraints",
        "Avoiding excessive Supabase writes from frequent small bookmark changes",
        "Keeping merge logic correct across deeply nested folder structures",
      ],

      solutionsImplemented: [
        "Built a tree-diff merge algorithm that resolves structural conflicts deterministically",
        "Scoped extension permissions to the minimum required APIs, reviewed against store policy",
        "Introduced write batching and debouncing, cutting network overhead by over 40%",
        "Added recursive test fixtures covering multi-level folder merge scenarios",
      ],

      results: [
        "Reduced sync-related network overhead by more than 40%",
        "Eliminated reported cases of bookmark data loss after launch",
        "Sync now completes in under 2 seconds on reconnect after extended offline use",
        "Maintained a 4.8-star average rating on the Chrome Web Store",
      ],

      metrics: {
        performance: "98/100",
        seo: "N/A",
        accessibility: "95/100",
        bestPractices: "100/100",
      },

      testimonial: {
        name: "Marcus Webb",
        role: "Founder",
        company: "SyncSpace",
        quote:
          "The offline-first sync engine Brain Stack built solved a problem we'd struggled with for months. Bookmarks just stay in sync now — no drama, no overwritten folders.",
        image: "/images/testimonials/customer-2.webp",
      },

      lessonsLearned: [
        "Local-first architecture should be the default for any tool that touches personal device state",
        "Tree-reconciliation is worth the upfront complexity when structural data can conflict",
        "Batching writes early prevents backend cost surprises as usage scales",
      ],

      nextSteps: [
        "Extend sync to Firefox and Safari extension APIs",
        "Add shared, team-level bookmark folders",
        "Introduce end-to-end encryption for synced data",
      ],

      relatedProjects: ["standard-insights", "big-fish"],
    },

    {
      id: "03",
      slug: "focus-pilot",
      kind: "case-study",
      title: "Focus Pilot",
      shortTitle: "Focus Pilot",
      category: "SaaS CRM",
      industry: "Interior Design",
      client: "Focus Pilot",
      service: null,
      technologies: [
        "Next.js",
        "Node.js",
        "MongoDB",
        "AI Agents",
        "RAG",
        "OpenAI API",
        "Claude API",
      ],
      tools: ["Docker", "Railway", "AWS", "Chart.js", "GitHub Actions"],
      duration: "9 weeks",
      date: null,
      status: "Live",
      liveUrl: "https://focuspilot.io",

      thumbnail: "https://i.ibb.co.com/9k9VBXVk/focus-pilot-thumbnail.png",
      heroImage: "https://i.ibb.co.com/9k9VBXVk/focus-pilot-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/JW6JNWNd/focus-pilot-1.png",
        "https://i.ibb.co.com/hxqQWYSh/focus-pilot-1-1.png",
        "https://i.ibb.co.com/LDSqVt7j/focus-pilot-2.png",
        "https://i.ibb.co.com/rfpy0ypd/focus-pilot-2-1.png",
        "https://i.ibb.co.com/HfkcSG05/focus-pilot-3.png",
        "https://i.ibb.co.com/66hbJt3/focus-pilot-3-1.png",
      ],

      overview:
        "Focus Pilot is an AI-powered studio operating system built specifically for interior design studios — project and procurement management, real-time budgets, an AI assistant, and a built-in CRM, replacing chaotic spreadsheets and email threads with live timelines and one-click client approvals. It's now live in public beta with tiered pricing for solo designers up through full studios.",

      challenge: {
        title: "Generic CRMs don't understand how design studios actually work",
        description:
          "Off-the-shelf CRMs forced our client's interior design business into sales pipelines that didn't map to project-based, highly visual design work, leaving teams to track the real details in spreadsheets and shared drives.",
        painPoints: [
          "No CRM concept of a 'project' with rooms, mood boards, and vendor line items",
          "Client follow-ups and proposal drafts consumed hours of designer time each week",
          "Studio owners had no consolidated view of project status across the team",
          "Existing tools lacked any AI assistance tailored to design workflows",
        ],
        businessImpact: [
          "Designers spent more time on admin than design work",
          "Missed follow-ups led to lost proposals and slower client conversion",
        ],
      },

      goals: [
        "Model projects, rooms, and mood boards natively, not as generic 'deals'",
        "Automate proposal drafts and follow-up emails with AI agents",
        "Give studio owners a real-time view across every active project",
        "Keep the platform multi-tenant ready for future studio customers",
      ],

      solution: {
        title: "A CRM that thinks in projects and rooms, not sales stages",
        description:
          "We built a multi-tenant SaaS CRM around a project-first data model, then layered AI agents (OpenAI + Claude, RAG-grounded on studio-specific data) that draft proposals and follow-ups a designer just reviews and sends.",
        highlights: [
          "Project-based CRM data model with rooms, mood boards, and vendor items",
          "AI agents for automated proposal and follow-up drafting",
          "AI assistant for email drafting, task creation, and meeting summaries",
          "Procurement and vendor management with AI-powered web clipping",
          "Owner-level analytics dashboard across all active projects",
          "Role-based admin panel for studio team management",
        ],
      },

      workflow: [
        {
          title: "Domain modeling with the client",
          description:
            "Workshopped the studio's real project lifecycle to design a data model around rooms and mood boards instead of generic sales stages.",
        },
        {
          title: "Core CRM build",
          description:
            "Built project, client, and vendor management on Next.js and MongoDB with a multi-tenant schema from the outset.",
        },
        {
          title: "AI agent integration",
          description:
            "Grounded OpenAI/Claude agents on each studio's project history via a RAG layer so drafts matched the studio's voice and past proposals.",
        },
        {
          title: "Dashboards & admin panel",
          description:
            "Shipped Chart.js dashboards for owners and a role-based admin panel for managing designers and permissions.",
        },
        {
          title: "Pilot & iterate",
          description:
            "Ran a paid pilot with a real design studio, then tuned AI prompt templates based on their edits to generated drafts.",
        },
      ],

      architecture: [
        "Multi-tenant CRM data model scoped by studio",
        "AI agent layer grounded via RAG on per-studio project history",
        "Redis + BullMQ background job processing for AI drafts",
        "Role-based admin panel and permission system",
        "Analytics dashboards built on Chart.js",
      ],

      features: [
        "Project, room, and mood board tracking",
        "AI-drafted proposals and client follow-ups",
        "AI assistant for email drafting, task creation, and meeting summaries",
        "Owner dashboard across all active studio projects",
        "Vendor and budget line-item tracking per project",
        "Tiered pricing from a free public beta up to a 20-member Professional plan",
      ],

      uiHighlights: [
        "Visual, mood-board-friendly project view",
        "Inline AI draft review with one-click send",
        "Owner analytics dashboard with project health indicators",
      ],

      developmentProcess: [
        "Discovery",
        "Research",
        "Planning",
        "Wireframing",
        "UI Design",
        "Development",
        "Testing",
        "Deployment",
        "Optimization",
      ],

      challengesFaced: [
        "Modeling a project-based workflow that didn't fit standard CRM pipeline patterns",
        "Grounding AI drafts in each studio's specific voice and past proposals",
        "Keeping the multi-tenant schema flexible enough for studios of different sizes",
        "Processing AI generation jobs without blocking the CRM UI",
      ],

      solutionsImplemented: [
        "Designed a custom project → room → mood board hierarchy as the CRM's core entity",
        "Built a RAG pipeline that retrieves each studio's historical proposals before generating drafts",
        "Used a schema-per-tenant strategy with shared indexes for cost-efficient scaling",
        "Queued all AI generation through BullMQ workers with real-time status updates",
      ],

      results: [
        "Cut proposal drafting time by roughly 70% for pilot studio designers",
        "Follow-up response rate improved after AI-assisted reminders went live",
        "Owners gained a single real-time view across every active project",
        "Zero downtime incidents during the multi-tenant rollout",
      ],

      metrics: {
        performance: "95/100",
        seo: "92/100",
        accessibility: "96/100",
        bestPractices: "100/100",
      },

      testimonial: {
        name: "Priya Nathan",
        role: "Studio Owner",
        company: "Focus Pilot",
        quote:
          "This finally feels like a CRM built for how we actually work. The AI drafts our follow-ups in our own voice, and I can see every project's status without chasing my team.",
        image: "/images/testimonials/customer-3.webp",
      },

      lessonsLearned: [
        "Domain-specific data models outperform generic CRM abstractions for niche industries",
        "Grounding AI output in real historical data dramatically improves adoption",
        "Pilot programs with real users surface prompt and UX issues no spec review would catch",
      ],

      nextSteps: [
        "Add AI-assisted budget forecasting per project",
        "Introduce client-facing portals for mood board approval",
        "Expand agent capabilities to vendor negotiation drafts",
      ],

      relatedProjects: ["standard-insights", "career-dock"],
    },

    {
      id: "04",
      slug: "career-dock",
      kind: "case-study",
      title: "Career Dock",
      shortTitle: "Career Dock",
      category: "SaaS Platform",
      industry: "Career & Recruitment",
      client: "Career Dock",
      service: null,
      technologies: ["Next.js", "Node.js", "MongoDB", "AI Agents", "OpenAI API"],
      tools: ["Docker", "Railway", "GitHub Actions", "Chart.js"],
      duration: "8 weeks",
      date: null,
      status: "Live",
      liveUrl: "https://careerdock.app",

      thumbnail: "https://i.ibb.co.com/Hpd4GQwM/career-dock-thumbnail.png",
      heroImage: "https://i.ibb.co.com/Hpd4GQwM/career-dock-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/TxNDMcnq/career-dock-1-1.png",
        "https://i.ibb.co.com/KxgCSTSH/career-dock-2-1.png",
        "https://i.ibb.co.com/wrwkkZJH/career-dock-2-2.png",
        "https://i.ibb.co.com/JFcXtwy7/career-dock-2-3.png",
        "https://i.ibb.co.com/HD1jsFYx/career-dock-5.png",
        "https://i.ibb.co.com/Rkbvy8dR/career-dock-6.png",
      ],

      overview:
        "Career Dock is a modern job-tracking application that helps job seekers organize applications, recruiter conversations, and interview follow-ups in one place, with a free plan plus a premium tier that unlocks AI-assisted resume matching, analytics, and reminders.",

      challenge: {
        title: "Job hunting scattered across tabs, spreadsheets, and inboxes",
        description:
          "Active job seekers were tracking dozens of applications across spreadsheets, email threads, and browser tabs, with no way to see application status, upcoming interviews, or follow-up deadlines at a glance.",
        painPoints: [
          "No single timeline view of every application's current stage",
          "Manually re-reading job descriptions to judge fit was slow and inconsistent",
          "Interview scheduling and follow-up reminders lived in separate tools",
          "No offline access when checking status on the go with spotty connectivity",
        ],
        businessImpact: [
          "Missed follow-ups reduced response and interview conversion rates",
          "Time spent on manual tracking cut directly into time spent actually applying",
        ],
      },

      goals: [
        "Centralize every application, interview, and follow-up in one timeline",
        "Use AI to score job-description-to-resume fit automatically",
        "Support offline-first usage for on-the-go tracking",
        "Keep the interface fast enough for daily, high-frequency use",
      ],

      solution: {
        title: "A single, AI-assisted command center for the job search",
        description:
          "We built Career Dock around a Kanban-style application timeline, with an AI agent that reads job descriptions against a user's resume to produce a fit score and suggested talking points, plus offline-first sync for reliable mobile use.",
        highlights: [
          "Kanban-style application and interview tracking board",
          "AI-assisted resume-to-job-description fit scoring",
          "Offline-first status sync for on-the-go updates",
          "Automated interview and follow-up reminders",
        ],
      },

      workflow: [
        {
          title: "User research",
          description:
            "Interviewed active job seekers to map the real stages of a search — from saved job to signed offer — before designing the data model.",
        },
        {
          title: "Core tracking build",
          description:
            "Built the Kanban board and application data model on Next.js and MongoDB, prioritizing fast status updates.",
        },
        {
          title: "AI fit scoring",
          description:
            "Integrated an OpenAI-backed agent that compares resume content against job descriptions and returns a fit score with rationale.",
        },
        {
          title: "Offline-first sync",
          description:
            "Added local caching and background sync so status updates made offline reconcile automatically once reconnected.",
        },
        {
          title: "Launch & feedback loop",
          description:
            "Shipped to early users and iterated the reminder system based on which nudges actually drove follow-up actions.",
        },
      ],

      architecture: [
        "Kanban-style application tracking data model",
        "AI scoring service comparing resume and job description embeddings",
        "Offline-first local cache with background reconciliation",
        "Scheduled job for interview and follow-up reminders",
      ],

      features: [
        "Drag-and-drop application and interview tracking",
        "AI resume-to-role fit scoring",
        "Recruiter-conversation tracking alongside application status",
        "Offline-first tracking with automatic sync on reconnect",
        "Interview and follow-up reminder notifications",
        "Free plan plus a premium tier gating AI assistance, analytics, and reminders",
      ],

      uiHighlights: [
        "Clean Kanban board with color-coded application stages",
        "Fit-score badges with expandable AI rationale",
        "Minimal, distraction-free mobile view for on-the-go updates",
      ],

      developmentProcess: [
        "Discovery",
        "Research",
        "Planning",
        "Wireframing",
        "UI Design",
        "Development",
        "Testing",
        "Deployment",
        "Optimization",
      ],

      challengesFaced: [
        "Keeping the Kanban board fast with frequent drag-and-drop status changes",
        "Producing AI fit scores that felt trustworthy rather than generic",
        "Reconciling offline edits made across multiple devices",
        "Designing reminders that nudged without becoming noise",
      ],

      solutionsImplemented: [
        "Used optimistic UI updates with background persistence for instant board interactions",
        "Tuned the AI scoring prompt with concrete resume examples to ground its rationale",
        "Applied last-write-wins with timestamp reconciliation for offline edits",
        "Let users tune reminder frequency per application stage",
      ],

      results: [
        "Users reported tracking applications in a third of the time compared to spreadsheets",
        "AI fit scoring surfaced overlooked strong-match roles for early testers",
        "Follow-up completion rate increased after reminders launched",
        "App remained fully usable through simulated offline test sessions",
      ],

      metrics: {
        performance: "97/100",
        seo: "93/100",
        accessibility: "95/100",
        bestPractices: "100/100",
      },

      testimonial: {
        name: "Daniel Ferris",
        role: "Early Adopter & Beta Tester",
        company: "Career Dock",
        quote:
          "I stopped losing track of applications the day I switched to Career Dock. The AI fit score alone saved me from wasting time on roles that were never a real match.",
        image: "/images/testimonials/customer-4.webp",
      },

      lessonsLearned: [
        "Offline-first isn't optional for tools people rely on during commutes and interviews",
        "AI scoring needs visible rationale to earn user trust, not just a number",
        "Optimistic UI updates matter more than raw API speed for perceived performance",
      ],

      nextSteps: [
        "Add browser extension for one-click job saving from listing sites",
        "Introduce salary negotiation guidance powered by AI",
        "Build a shared view for career coaches supporting multiple job seekers",
      ],

      relatedProjects: ["standard-insights", "focus-pilot"],
    },

    {
      id: "11",
      slug: "karially",
      kind: "portfolio",
      title: "Karially",
      shortTitle: "Karially",
      category: "AI Platform",
      industry: "Career Technology",
      client: "Karially",
      service: "AI Product Design, Web App Development",
      technologies: ["React", "TypeScript", "Tailwind CSS", "OpenAI"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://karially.com/",

      thumbnail: "https://i.ibb.co.com/Y4wKKRwC/karially-thumbnail.png",
      heroImage: "https://i.ibb.co.com/Y4wKKRwC/karially-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/60FvJWzx/karially-1-1.png",
        "https://i.ibb.co.com/svM22Bv9/karially-2-1.png",
        "https://i.ibb.co.com/5gHkkw0t/karially-3-1.png",
        "https://i.ibb.co.com/GNbpnc0/karially-3-2.png",
        "https://i.ibb.co.com/3yj3nTzm/karially-4-1.png",
        "https://i.ibb.co.com/My79t1Z6/karially-4-2.png",
      ],

      overview:
        "Karially is a career-growth membership that bundles AI tools with real human support — an AI-built roadmap with weekly milestones, an AI resume and cover-letter builder, and live coaching and classes, all under one subscription instead of juggling separate tools.",

      challenge: {
        title: null,
        description:
          "Professionals were overwhelmed by scattered career resources and generic advice that failed to adapt to their unique goals, leaving ambitious talent without a clear path to grow.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Guide every career journey with intelligent, personalized tools and real support",
        description:
          "We built an AI-powered membership platform that learns from each user's goals, generates a personalized career roadmap, and pairs it with an AI resume and cover-letter builder, live monthly classes, and 1:1 coaching — turning generic advice into guidance that actually fits.",
        highlights: [
          "Product Strategy",
          "UX/UI Design",
          "AI Integration",
          "AI Resume & Cover Letter Builder",
          "Front-end Development",
          "Design System",
        ],
      },

    },

    {
      id: "12",
      slug: "luxeb2b",
      kind: "portfolio",
      title: "LUXEB2B",
      shortTitle: "LUXEB2B",
      category: "Business",
      industry: "Luxury Fragrance & Beauty",
      client: "LUXEB2B",
      service: "Marketplace Platform, Brand Identity",
      technologies: ["Next.js", "React", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://luxeb2b.com/",

      thumbnail: "https://i.ibb.co.com/nswg2vX3/luxeb2b-thumbnail.png",
      heroImage: "https://i.ibb.co.com/nswg2vX3/luxeb2b-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/bVbPKhY/luxeb2b-1-1.png",
        "https://i.ibb.co.com/Cs7WypV8/luxeb2b-1-2.png",
        "https://i.ibb.co.com/5gjxMxL5/luxeb2b-2-1.png",
        "https://i.ibb.co.com/v73h7yN/luxeb2b-3-1.png",
        "https://i.ibb.co.com/KcZkzp96/luxeb2b-4-1.png",
        "https://i.ibb.co.com/G4qwmLYx/luxeb2b-6.png",
      ],

      overview:
        "A premium B2B directory and lead-discovery network connecting global buyers and suppliers in the luxury fragrance and beauty industry — company profiles, product listings, and category browsing across perfumes, oud, niche fragrances, and cosmetics.",

      challenge: {
        title: null,
        description:
          "Global buyers and suppliers in the luxury fragrance industry lacked a trusted digital marketplace, relying instead on fragmented trade shows and manual negotiations that slowed every deal.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Connect a global luxury trade on one premium directory",
        description:
          "We designed and built a B2B network that lets suppliers create free company profiles and list products by category, and lets buyers discover and browse verified partners across the luxury fragrance and beauty trade — packaged in an experience that matches the prestige of the products themselves.",
        highlights: [
          "Marketplace UX",
          "Front-end Development",
          "Vendor Onboarding Flows",
          "Brand Identity",
        ],
      },

    },

    {
      id: "13",
      slug: "ach-gold-estates",
      kind: "portfolio",
      title: "ACH Gold Estates",
      shortTitle: "ACH Gold Estates",
      category: "Business",
      industry: "Real Estate",
      client: "ACH Gold Estates",
      service: "Real Estate Platform, CMS Integration",
      technologies: ["Next.js", "CMS", "Google Maps"],
      tools: [],
      duration: null,
      date: "2023",
      status: null,
      liveUrl: "https://achgoldestates.com/",

      thumbnail: "https://i.ibb.co.com/QvdwJKLs/ach-gold-estates-thumbnail.png",
      heroImage: "https://i.ibb.co.com/QvdwJKLs/ach-gold-estates-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/1f04zW1k/ach-gold-estates-1-1.png",
        "https://i.ibb.co.com/rGTRfpVL/ach-gold-estates-2-1.png",
        "https://i.ibb.co.com/ynJPzKn7/ach-gold-estates-3-1.png",
        "https://i.ibb.co.com/Q7WWmnwz/ach-gold-estates-4-1.png",
        "https://i.ibb.co.com/KM3VHV7/ach-gold-estates-5-1.png",
        "https://i.ibb.co.com/Zzp43M2X/ach-gold-estates-6-1.png",
      ],

      overview:
        "A modern student accommodation platform for Nottingham and Derby, UK, with searchable verified listings for prospective tenants and a dedicated partner pathway for letting agents to list their own properties.",

      challenge: {
        title: null,
        description:
          "Prospective tenants and buyers struggled to find accurate, up-to-date property listings, forcing the agency's team to manually field repetitive inquiries instead of closing deals.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Turn property browsing into a seamless self-serve experience",
        description:
          "We delivered a modern listings platform with an integrated CMS and map-based search, letting the team publish new inventory in minutes and letting prospects filter, compare and enquire without ever picking up the phone.",
        highlights: [
          "Web Development",
          "CMS Integration",
          "Google Maps Integration",
          "UX/UI Design",
        ],
      },

    },

    {
      id: "17",
      slug: "powernest",
      kind: "portfolio",
      title: "PowerNest",
      shortTitle: "PowerNest",
      category: "E-commerce Platform",
      industry: "Consumer Electronics Retail",
      client: "PowerNest",
      service: "E-commerce Development, Payment Integration",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://powernest-nu.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-7.webp",
      heroImage: "/images/project-thumbnails/thumbnail-7.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "PowerNest is a full online electronics storefront built for Bangladeshi shoppers — power banks, headphones, phones, laptops, and accessories, with local bKash/Nagad payments, cash on delivery, and 0% EMI on every order.",

      challenge: {
        title: null,
        description:
          "Bangladeshi shoppers had few online electronics retailers they could trust for genuine products, and even fewer that supported the local payment methods most households actually use.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Build an online electronics store Bangladeshi shoppers actually trust",
        description:
          "We built a full e-commerce platform around 100% genuine products with official warranty, integrated bKash, Nagad, and cash-on-delivery alongside 0% EMI up to 24 months, and backed it with nationwide free delivery and a 7-day return policy.",
        highlights: [
          "E-commerce Development",
          "Local Payment Integration (bKash, Nagad, COD)",
          "UX/UI Design",
        ],
      },

    },

    {
      id: "19",
      slug: "yachtease",
      kind: "portfolio",
      title: "YachtEase",
      shortTitle: "YachtEase",
      category: "Marketplace Platform",
      industry: "Yachting & Marine Operations",
      client: "YachtEase",
      service: "Marketplace Platform, Operations Dashboard",
      technologies: ["Next.js", "Tailwind CSS", "Stripe"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://yachtease.co/",

      thumbnail: "/images/project-thumbnails/thumbnail-9.webp",
      heroImage: "/images/project-thumbnails/thumbnail-9.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "YachtEase is an operations marketplace built for the yachting industry — one dashboard connecting yacht management, suppliers, crew, and freelancers so senior crew can source, hire, and communicate without juggling emails and spreadsheets.",

      challenge: {
        title: null,
        description:
          "Running a yacht's day-to-day operations meant sourcing suppliers, hiring crew, and coordinating logistics across scattered email threads and chat apps, with no single place to track quotes, orders, or who was available in the next port.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Give yacht operations a single, considered workspace",
        description:
          "We built a role-based marketplace with dedicated entry points for yacht management, suppliers, crew, and freelancers — bundling quotes, orders, invoices, and messaging into one thread per supplier, with port-based search and verified profiles.",
        highlights: [
          "Marketplace Platform Development",
          "Role-Based Dashboards",
          "Booking & Messaging System",
          "UX/UI Design",
        ],
      },

    },

    {
      id: "15",
      slug: "big-fish",
      kind: "portfolio",
      title: "Big Fish",
      shortTitle: "Big Fish",
      category: "Portfolio",
      industry: "Creative Studio",
      client: "Big Fish",
      service: "Creative Portfolio, Interactive Design",
      technologies: ["Next.js", "GSAP", "Framer Motion"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: null,

      thumbnail: "https://i.ibb.co.com/KpqvTX5R/big-fish-thumbnail.png",
      heroImage: "https://i.ibb.co.com/KpqvTX5R/big-fish-thumbnail.png",
      gallery: [
        "https://i.ibb.co.com/Q358mmwq/big-fish-1-1.png",
        "https://i.ibb.co.com/j9rz2FT7/big-fish-1-2.png",
        "https://i.ibb.co.com/Mx7r2DyB/big-fish-1-3.png",
        "https://i.ibb.co.com/mCnLnxwN/big-fish-1-4.png",
        "https://i.ibb.co.com/1tpN2GHj/big-fish-1-5.png",
        "https://i.ibb.co.com/RTvb5dhj/big-fish-6.png",
      ],

      overview:
        "An interactive portfolio experience with immersive layouts, storytelling, and engaging motion design.",

      challenge: {
        title: null,
        description:
          "A standard grid portfolio couldn't capture the studio's storytelling-driven creative process, making their work feel flatter online than it does in the room.",
        painPoints: [],
        businessImpact: [],
      },

      solution: {
        title: "Turn scrolling into a story worth staying for",
        description:
          "We built an immersive, motion-first portfolio where layout and animation carry the narrative — every project unfolds like a scene rather than a static case study.",
        highlights: [
          "Interaction Design",
          "GSAP Animation",
          "Framer Motion",
          "Front-end Development",
        ],
      },

    },
  ] satisfies Project[],
} as const

/** Home-page "featured projects" teaser (CaseStudiesSection). Distinct copy from projectsData's own badge/title/description, which drives the marquee + /projects listing. */
export const projectsShowcaseData = {
  badge: "Case Studies",
  title: "Proven Results Across Every Product Surface",
  description:
    "From scalable SaaS platforms and browser extensions to AI-powered CRMs, marketplaces, and booking systems, we design and develop modern digital products that help businesses innovate, automate, and grow with confidence.",
  stat: {
    value: "100%",
    label: "Client Satisfaction Rate",
  },
} as const
