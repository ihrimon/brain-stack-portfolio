import type { Testimonial } from "./shared-types"

export interface Project {
  id: string
  slug: string
  title: string
  shortTitle: string
  category: string
  industry: string
  client: string
  /** Short service line, e.g. "AI Product Design, Web App Development". Portfolio-only projects. */
  service: string | null
  technologies: string[]
  tools: string[]
  duration: string | null
  /** Year completed, e.g. "2024". Portfolio-only projects. */
  date: string | null
  status: string | null
  liveUrl: string | null

  thumbnail: string
  heroImage: string
  gallery: string[]

  overview: string

  challenge: {
    title: string | null
    description: string
    painPoints: string[]
    businessImpact: string[]
  } | null

  goals: string[]

  solution: {
    title: string
    description: string
    highlights: string[]
  }

  workflow: { title: string; description: string }[]

  architecture: string[]
  features: string[]
  uiHighlights: string[]
  developmentProcess: string[]
  challengesFaced: string[]
  solutionsImplemented: string[]
  results: string[]

  metrics: {
    performance: string
    seo: string
    accessibility: string
    bestPractices: string
  } | null

  testimonial: Testimonial | null

  lessonsLearned: string[]
  nextSteps: string[]
  relatedProjects: string[]
}

export const projectsData = {
  badge: "Featured Work",
  title: "Selected Projects That Reflect Our Expertise",
  description:
    "From AI-powered platforms and SaaS products to luxury marketplaces, real estate solutions, and modern portfolio websites, each project demonstrates our commitment to creating scalable, user-focused, and visually engaging digital experiences.",

  projects: [
    {
      id: "01",
      slug: "standard-insights",
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

      thumbnail: "/images/project-thumbnails/thumbnail-1.webp",
      heroImage: "/images/project-thumbnails/thumbnail-1.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
      ],

      overview:
        "Standard Insights is a multi-tenant SaaS platform that lets businesses build surveys, collect customer feedback, and turn raw responses into decision-ready insight. We built the product end-to-end, from the survey builder and analytics dashboards to an AI layer that reads open-ended responses and surfaces themes automatically.",

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
          "We designed a multi-tenant architecture from day one, then layered a drag-and-drop survey builder, live analytics dashboards, and an AI/RAG pipeline that reads open text responses and generates theme summaries and sentiment scores automatically.",
        highlights: [
          "Dynamic, drag-and-drop survey builder with branching logic",
          "AI agents (OpenAI + Claude) for automatic theming and sentiment analysis",
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

      thumbnail: "/images/project-thumbnails/thumbnail-2.webp",
      heroImage: "/images/project-thumbnails/thumbnail-2.webp",
      gallery: [
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
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

      relatedProjects: ["binder-app", "nft-maria"],
    },

    {
      id: "03",
      slug: "focus-pilot",
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

      thumbnail: "/images/project-thumbnails/thumbnail-3.webp",
      heroImage: "/images/project-thumbnails/thumbnail-3.webp",
      gallery: [
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
      ],

      overview:
        "Focus Pilot is an AI-powered CRM built specifically for interior design studios — tracking clients, projects, and mood boards while using AI agents to automate the busywork of proposal drafting and client follow-ups.",

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
        "Owner dashboard across all active studio projects",
        "Vendor and budget line-item tracking per project",
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

      thumbnail: "/images/project-thumbnails/thumbnail-4.webp",
      heroImage: "/images/project-thumbnails/thumbnail-4.webp",
      gallery: [
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
        "/images/projects/project-1.webp",
      ],

      overview:
        "Career Dock is a modern job-tracking application that helps job seekers organize applications, interviews, and follow-ups in one place, with AI assistance for matching roles against a candidate's resume and history.",

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
        "Offline-first tracking with automatic sync on reconnect",
        "Interview and follow-up reminder notifications",
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
      id: "05",
      slug: "binder-app",
      title: "Binder App",
      shortTitle: "Binder",
      category: "Social / Dating App",
      industry: "Social Networking",
      client: "Confidential Client",
      service: null,
      technologies: ["Next.js", "Tailwind CSS", "Express", "Node.js", "MongoDB", "Socket.io"],
      tools: ["Cloudinary", "JWT Auth", "GitHub Actions"],
      duration: "6 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-5.webp",
      heroImage: "/images/project-thumbnails/thumbnail-5.webp",
      gallery: [
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
      ],

      overview:
        "Binder App is a full-stack, Tinder-style matching platform built to validate a new dating concept quickly — combining a swipe-based discovery feed, a preference-based matching algorithm, and real-time chat.",

      challenge: {
        title: "Validating a matching concept before over-investing in scale",
        description:
          "The client needed a fully functional matching and chat product fast enough to test the core concept with real users, without cutting corners on the two features that make or break a dating app: match quality and chat reliability.",
        painPoints: [
          "No existing matching algorithm tuned to the client's specific preference criteria",
          "Real-time chat needed to feel instant, not request-refresh based",
          "Swipe-based discovery had to stay performant as the user base grew",
          "Tight timeline left no room for a heavyweight, over-engineered backend",
        ],
        businessImpact: [
          "Every week of delay was a week of lost user feedback on the core concept",
          "A laggy chat experience would undermine trust before the product had a chance to prove itself",
        ],
      },

      goals: [
        "Ship a working matching algorithm based on mutual preferences and location",
        "Deliver real-time chat with no perceptible lag",
        "Build a swipe-based discovery feed that performs smoothly at scale",
        "Keep the stack lean enough to iterate quickly post-launch",
      ],

      solution: {
        title: "A lean, fast matching and chat product built to ship in weeks",
        description:
          "We built a preference and geo-based matching engine on MongoDB's geospatial queries, paired with a Socket.io-powered real-time chat layer and a swipe feed optimized for smooth, low-latency interaction.",
        highlights: [
          "Preference and location-based matching algorithm",
          "Real-time chat built on Socket.io with delivery and read receipts",
          "Swipe-based discovery feed with prefetching for smooth performance",
          "JWT-based authentication with secure session handling",
        ],
      },

      workflow: [
        {
          title: "Matching logic design",
          description:
            "Defined the matching criteria and scoring weights with the client, then modeled it as a queryable MongoDB geospatial index.",
        },
        {
          title: "Core app build",
          description:
            "Built the swipe feed, profile system, and matching engine on Next.js, Express, and MongoDB.",
        },
        {
          title: "Real-time chat",
          description:
            "Layered Socket.io on top for instant messaging, with delivery and read-receipt events.",
        },
        {
          title: "Performance pass",
          description:
            "Added feed prefetching and image optimization to keep swiping smooth under real usage.",
        },
        {
          title: "Beta launch",
          description:
            "Shipped to a closed beta group to validate match quality and chat engagement before wider rollout.",
        },
      ],

      architecture: [
        "Preference and geo-based matching engine using MongoDB geospatial queries",
        "Socket.io real-time messaging layer with delivery/read receipts",
        "JWT-based authentication and session management",
        "Prefetching discovery feed for low-latency swiping",
      ],

      features: [
        "Swipe-based discovery feed",
        "Preference and location-based matching",
        "Real-time chat with delivery and read receipts",
        "Profile management with photo uploads",
      ],

      uiHighlights: [
        "Smooth, gesture-driven swipe cards",
        "Instant match animation on mutual likes",
        "Typing indicators and read receipts in chat",
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
        "Keeping the swipe feed smooth as profile volume grew",
        "Delivering chat messages with no perceptible delay",
        "Designing a matching algorithm that felt relevant, not random",
        "Shipping a full matching + chat product on a compressed timeline",
      ],

      solutionsImplemented: [
        "Added feed prefetching and image lazy-loading to keep swipe interactions smooth",
        "Used Socket.io rooms per conversation to minimize message broadcast overhead",
        "Weighted matching scores by mutual preferences and proximity, tuned against beta feedback",
        "Prioritized a lean MVP feature set to hit the client's beta launch deadline",
      ],

      results: [
        "Delivered a fully working matching and chat product within 6 weeks",
        "Beta users reported chat felt instant with no noticeable lag",
        "Matching algorithm produced meaningfully higher mutual-like rates than random pairing",
        "Validated the core concept, informing the client's decision to move to full production",
      ],

      metrics: {
        performance: "94/100",
        seo: "N/A",
        accessibility: "93/100",
        bestPractices: "98/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Founder",
        company: "Binder App",
        quote:
          "Brain Stack took our concept from idea to a working, testable product in weeks. The chat felt instant and the matching just worked — exactly what we needed to validate before scaling.",
        image: "/images/testimonials/customer-5.webp",
      },

      lessonsLearned: [
        "Socket.io rooms scoped per conversation keep real-time chat lean as users grow",
        "A tightly-scoped MVP beats a feature-complete app when validating a new concept",
        "Prefetching is often a bigger perceived-performance win than raw backend speed",
      ],

      nextSteps: [
        "Add video call support for matched users",
        "Introduce icebreaker prompts to boost first-message rates",
        "Layer in AI-assisted profile bio suggestions",
      ],

      relatedProjects: ["sync-space", "nft-maria"],
    },

    {
      id: "06",
      slug: "apartment-selling-site",
      title: "Apartment Selling Site",
      shortTitle: "Apartment Hub",
      category: "Real Estate Platform",
      industry: "Real Estate",
      client: "Confidential Client",
      service: null,
      technologies: ["React.js", "Firebase", "Bootstrap", "Node.js", "Express"],
      tools: ["Firebase Auth", "Firebase Firestore", "Cloudinary", "Netlify"],
      duration: "6 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-6.webp",
      heroImage: "/images/project-thumbnails/thumbnail-6.webp",
      gallery: [
        "/images/projects/project-6.webp",
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
      ],

      overview:
        "A full-stack real estate platform for listing, browsing, and managing apartment sales, with secure authentication and an admin dashboard that lets agents publish and moderate listings without developer help.",

      challenge: {
        title: "Manual listing management was slowing down every sale",
        description:
          "The client's agents were publishing listings through ad-hoc spreadsheets and static pages, making it slow to add new inventory, hard for buyers to search effectively, and impossible to track listing status in one place.",
        painPoints: [
          "No searchable, filterable listing experience for buyers",
          "Publishing a new listing required manual page edits",
          "No role separation between buyers, agents, and admins",
          "Listing photos and details were inconsistent across pages",
        ],
        businessImpact: [
          "Agents spent hours on manual publishing instead of client-facing work",
          "Buyers dropped off when they couldn't filter listings by their own criteria",
        ],
      },

      goals: [
        "Let agents publish and update listings without developer involvement",
        "Give buyers robust search and filtering across listings",
        "Add secure, role-based authentication for buyers, agents, and admins",
        "Present listings with a consistent, professional photo and detail layout",
      ],

      solution: {
        title: "A self-serve listings platform with a real admin workflow",
        description:
          "We built a React front end backed by Firebase, giving agents a dashboard to publish and manage listings directly, while buyers get a fast, filterable browsing experience with consistent listing pages.",
        highlights: [
          "Self-serve agent dashboard for publishing and editing listings",
          "Buyer-facing search and filter system across price, location, and size",
          "Role-based access for buyers, agents, and admins",
          "Cloudinary-backed image pipeline for consistent listing photos",
        ],
      },

      workflow: [
        {
          title: "Listing data model",
          description:
            "Defined a structured listing schema in Firestore covering pricing, location, amenities, and media.",
        },
        {
          title: "Agent dashboard",
          description:
            "Built the publishing and moderation dashboard first, so agents could start migrating listings early in the project.",
        },
        {
          title: "Buyer search experience",
          description:
            "Implemented filterable search and listing detail pages with a consistent photo gallery layout.",
        },
        {
          title: "Auth & roles",
          description:
            "Added Firebase Authentication with role separation for buyers, agents, and admins.",
        },
        {
          title: "QA & handover",
          description:
            "Ran through real listing publishing workflows with the client's agents before go-live and documented the admin flow.",
        },
      ],

      architecture: [
        "Role-based access control for buyer, agent, and admin roles",
        "Firestore-backed listings database with structured schema",
        "Cloudinary image pipeline for consistent listing photos",
        "REST endpoints for listing search and filtering",
      ],

      features: [
        "Searchable, filterable apartment listings",
        "Agent dashboard for publishing and editing listings",
        "Role-based authentication for buyers, agents, and admins",
        "Consistent listing detail pages with photo galleries",
      ],

      uiHighlights: [
        "Clean, filterable listing grid with map-adjacent detail views",
        "Consistent photo gallery layout across every listing",
        "Simple, guided listing publish flow for agents",
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
        "Designing a listing schema flexible enough for varied property types",
        "Making search and filtering fast as listing volume grew",
        "Giving agents a publishing workflow simple enough to use without training",
        "Keeping listing photos consistent in quality and aspect ratio",
      ],

      solutionsImplemented: [
        "Structured the Firestore schema around normalized amenity and pricing fields for reliable filtering",
        "Indexed common filter fields and paginated search results",
        "Designed a step-by-step publish wizard with inline validation for agents",
        "Standardized image uploads through a Cloudinary transformation pipeline",
      ],

      results: [
        "Cut new-listing publishing time from hours to minutes",
        "Buyers could filter listings by price, location, and size instantly",
        "Agents fully self-served listing management without developer support",
        "Consistent listing presentation improved perceived platform quality",
      ],

      metrics: {
        performance: "93/100",
        seo: "95/100",
        accessibility: "94/100",
        bestPractices: "97/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Operations Lead",
        company: "Apartment Selling Site",
        quote:
          "Our agents publish listings themselves now — no more waiting on developers. Buyers can actually find what they're looking for, and it shows in how much faster listings move.",
        image: "/images/testimonials/customer-1.webp",
      },

      lessonsLearned: [
        "A well-normalized listing schema is what makes filtering actually useful",
        "Self-serve publishing tools need guardrails, not just freedom, to stay consistent",
        "Standardizing media pipelines early prevents inconsistent content later",
      ],

      nextSteps: [
        "Add map-based search with drawable radius filters",
        "Introduce saved searches and buyer alerts",
        "Build an agent performance dashboard for listing engagement",
      ],

      relatedProjects: ["travel-agency-application", "teacher-world"],
    },

    {
      id: "07",
      slug: "travel-agency-application",
      title: "Travel Agency Application",
      shortTitle: "Travel Agency",
      category: "Booking Platform",
      industry: "Travel & Hospitality",
      client: "Confidential Client",
      service: null,
      technologies: ["React.js", "Firebase", "Bootstrap", "Node.js", "Express"],
      tools: ["Firebase Auth", "REST APIs", "Netlify"],
      duration: "7 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-7.webp",
      heroImage: "/images/project-thumbnails/thumbnail-7.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-5.webp",
      ],

      overview:
        "A high-performance travel booking platform covering destination discovery, package management, and end-to-end booking, built with an admin dashboard for the agency's team to manage inventory and reservations.",

      challenge: {
        title: "Slow booking flows were costing conversions",
        description:
          "The agency's previous booking process relied on manual back-and-forth to confirm availability and pricing, creating friction that lost bookings to faster competitors, while the internal team lacked a dashboard to manage packages efficiently.",
        painPoints: [
          "No real-time availability checks during the booking flow",
          "Destination and package content was hard to update without developer help",
          "Slow API responses on search made browsing feel sluggish",
          "No centralized admin view of bookings and inventory",
        ],
        businessImpact: [
          "Booking friction pushed prospective travelers to competitor platforms",
          "The team spent excess time manually confirming availability by phone and email",
        ],
      },

      goals: [
        "Deliver a fast, self-serve booking flow with live availability",
        "Let the agency manage destinations and packages without developer support",
        "Optimize API response times for search-heavy browsing",
        "Provide a centralized admin dashboard for bookings and inventory",
      ],

      solution: {
        title: "A booking flow fast enough to convert on the first visit",
        description:
          "We rebuilt the booking flow around optimized REST APIs and a real-time availability engine, paired with an admin dashboard so the agency's team could manage destinations, packages, and reservations directly.",
        highlights: [
          "Real-time availability and pricing engine for the booking flow",
          "Self-serve admin dashboard for destinations and packages",
          "Optimized REST APIs and database queries for fast search",
          "Role-based access for admins and booking agents",
        ],
      },

      workflow: [
        {
          title: "Booking flow mapping",
          description:
            "Mapped the ideal booking journey from search to confirmation, identifying every step causing drop-off in the old flow.",
        },
        {
          title: "Catalog & admin build",
          description:
            "Built the destination and package catalog with an admin dashboard so the team could manage content independently.",
        },
        {
          title: "Booking engine",
          description:
            "Implemented the real-time availability and pricing engine backing the booking flow.",
        },
        {
          title: "Performance optimization",
          description:
            "Profiled and optimized REST endpoints and database queries powering search and filtering.",
        },
        {
          title: "Launch & monitoring",
          description:
            "Rolled out with monitoring on booking completion rates to catch any remaining friction points.",
        },
      ],

      architecture: [
        "Destination and package catalog service",
        "Real-time booking and availability engine",
        "Admin dashboard for itinerary and inventory management",
        "Optimized REST endpoints for search and filtering",
      ],

      features: [
        "Real-time destination and package search",
        "End-to-end booking flow with live availability",
        "Admin dashboard for managing packages and reservations",
        "Role-based access for admins and booking agents",
      ],

      uiHighlights: [
        "Visual destination browsing with rich imagery",
        "Streamlined multi-step booking flow with progress indicators",
        "Admin dashboard with at-a-glance booking status",
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
        "Delivering real-time availability without slowing down search",
        "Reducing booking-flow drop-off caused by unclear pricing steps",
        "Optimizing backend performance for high-volume search and filtering",
        "Giving the agency's team a dashboard simple enough for daily use",
      ],

      solutionsImplemented: [
        "Cached frequently-queried availability data with short TTLs to keep search fast and accurate",
        "Simplified the booking flow to three clear steps with upfront pricing",
        "Indexed and optimized the most-used search and filter queries",
        "Designed the admin dashboard around the agency's actual daily workflow, validated with their team",
      ],

      results: [
        "Significantly improved API response times and reduced page load delays",
        "Streamlined booking flow reduced steps needed to complete a reservation",
        "Agency team fully self-served destination and package updates",
        "Admin dashboard gave real-time visibility into bookings for the first time",
      ],

      metrics: {
        performance: "95/100",
        seo: "94/100",
        accessibility: "93/100",
        bestPractices: "98/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Managing Director",
        company: "Travel Agency Application",
        quote:
          "Bookings that used to take phone calls and emails now happen in minutes online. The admin dashboard alone has saved our team hours every week.",
        image: "/images/testimonials/customer-2.webp",
      },

      lessonsLearned: [
        "Short-TTL caching balances real-time accuracy with search performance well",
        "Cutting a booking flow down to its essential steps has an outsized impact on conversion",
        "Admin tools should be designed around existing team workflows, not idealized ones",
      ],

      nextSteps: [
        "Add dynamic pricing based on demand and seasonality",
        "Introduce multi-currency support for international travelers",
        "Build a loyalty and repeat-booking rewards system",
      ],

      relatedProjects: ["apartment-selling-site", "e-learny-platform"],
    },

    {
      id: "08",
      slug: "nft-maria",
      title: "NFT Maria",
      shortTitle: "NFT Maria",
      category: "Web3 Landing Page",
      industry: "Blockchain Gaming",
      client: "NFT Maria",
      service: null,
      technologies: ["Next.js", "Tailwind CSS", "Framer Motion", "GSAP"],
      tools: ["Vercel", "Figma"],
      duration: "4 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-8.webp",
      heroImage: "/images/project-thumbnails/thumbnail-8.webp",
      gallery: [
        "/images/projects/project-2.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "NFT Maria is a Web3 landing page for an NFT-based blockchain game, built to generate pre-launch hype through bold visuals and scroll-driven motion design ahead of the project's token launch.",

      challenge: {
        title: "A generic template couldn't carry a Web3 launch",
        description:
          "The client needed a landing page that felt as ambitious as the game itself, capable of holding attention through a full narrative scroll and converting visitors into whitelist sign-ups before launch — something no off-the-shelf template could deliver.",
        painPoints: [
          "Generic Web3 templates looked identical to dozens of competing projects",
          "No motion or storytelling to communicate the game's world and lore",
          "Tight pre-launch timeline left little room for a heavyweight build",
          "Needed to convert visitors into whitelist sign-ups, not just inform them",
        ],
        businessImpact: [
          "A forgettable landing page would blend into a saturated NFT launch market",
          "Delayed launch timing risked missing the window of community hype",
        ],
      },

      goals: [
        "Design a visually distinctive page that stands out in the NFT space",
        "Use scroll-driven animation to tell the game's world and lore",
        "Drive whitelist sign-ups with clear, motion-guided CTAs",
        "Ship within a tight four-week pre-launch window",
      ],

      solution: {
        title: "A scroll-driven launch page built to convert attention into sign-ups",
        description:
          "We designed a static-first, component-based landing page with GSAP and Framer Motion sequences that reveal the game's world section by section, keeping the build lightweight enough to ship fast without sacrificing visual ambition.",
        highlights: [
          "Scroll-driven animation sequences built with GSAP and Framer Motion",
          "Component-based section architecture for rapid content iteration",
          "Static-first build for fast load times and easy hosting",
          "Motion-guided CTAs directing visitors to whitelist sign-up",
        ],
      },

      workflow: [
        {
          title: "Concept & moodboarding",
          description:
            "Aligned on visual direction and narrative beats with the client in Figma before any development began.",
        },
        {
          title: "Section architecture",
          description:
            "Broke the page into independent, reusable sections so content and ordering could change quickly without rework.",
        },
        {
          title: "Motion design",
          description:
            "Built scroll-triggered GSAP and Framer Motion sequences for each section to reveal the game's world progressively.",
        },
        {
          title: "Performance pass",
          description:
            "Optimized asset loading and animation performance to keep the page fast despite heavy visual content.",
        },
        {
          title: "Launch",
          description:
            "Deployed on Vercel ahead of the client's announced launch date, with analytics on sign-up conversion.",
        },
      ],

      architecture: [
        "Static-first marketing site architecture",
        "Component-based, independently reusable page sections",
        "Scroll-triggered animation sequences",
      ],

      features: [
        "Scroll-driven narrative reveal of the game's world",
        "Bold, animated hero and section transitions",
        "Whitelist sign-up flow with motion-guided CTAs",
      ],

      uiHighlights: [
        "Full-bleed, animated hero sequence",
        "Parallax and reveal effects synced to scroll position",
        "Consistent dark, high-contrast Web3 visual identity",
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
        "Balancing heavy motion design with fast page load times",
        "Standing out visually in a crowded, template-heavy NFT landing page market",
        "Delivering a polished, animation-rich build in a four-week window",
        "Keeping animation performant across a range of devices",
      ],

      solutionsImplemented: [
        "Used GPU-accelerated transforms and lazy-loaded heavy assets to protect load time",
        "Designed a custom visual language instead of adapting an existing Web3 template",
        "Built sections as independent components to parallelize design and development work",
        "Tested animation performance across low- and high-end devices, tuning easing and complexity accordingly",
      ],

      results: [
        "Shipped a fully animated, launch-ready page within the four-week deadline",
        "Page load stayed fast despite heavy scroll-driven animation",
        "Whitelist sign-up CTAs saw strong click-through during the pre-launch campaign",
        "Distinctive visual identity helped the project stand out ahead of launch",
      ],

      metrics: {
        performance: "92/100",
        seo: "96/100",
        accessibility: "91/100",
        bestPractices: "97/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Project Lead",
        company: "NFT Maria",
        quote:
          "Brain Stack gave our launch a page that actually felt like the game we were building. It stood out immediately from every other NFT landing page out there.",
        image: "/images/testimonials/customer-3.webp",
      },

      lessonsLearned: [
        "A custom visual identity outperforms adapted templates in saturated markets",
        "Scroll-driven storytelling needs disciplined performance budgeting to stay smooth",
        "Component-based sections make last-minute content changes painless before launch",
      ],

      nextSteps: [
        "Add a live mint counter synced to on-chain data",
        "Introduce a community leaderboard section",
        "Build a post-launch dashboard for holder benefits",
      ],

      relatedProjects: ["sync-space", "binder-app"],
    },

    {
      id: "09",
      slug: "e-learny-platform",
      title: "E-learny Platform",
      shortTitle: "E-learny",
      category: "Learning Management System",
      industry: "EdTech",
      client: "E-learny",
      service: null,
      technologies: ["React.js", "Node.js", "Express", "Bootstrap", "REST API"],
      tools: ["Firebase Auth", "MongoDB Atlas", "Netlify"],
      duration: "9 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-9.webp",
      heroImage: "/images/project-thumbnails/thumbnail-9.webp",
      gallery: [
        "/images/projects/project-5.webp",
        "/images/projects/project-1.webp",
        "/images/projects/project-3.webp",
      ],

      overview:
        "E-learny is a full-stack learning management system in the spirit of Udemy, built for instructors to publish courses and for students to learn and track progress through a clean, structured experience.",

      challenge: {
        title: "Course creators needed a real platform, not a video hosting hack",
        description:
          "The client had been distributing course content through disconnected video hosts and PDFs, with no way to structure curricula, track student progress, or manage enrollment — undermining both the learning experience and the business model.",
        painPoints: [
          "No structured course and lesson hierarchy for instructors to build around",
          "No progress tracking, so students and instructors couldn't see completion",
          "Enrollment and access control were handled manually",
          "Admin had no visibility into platform-wide course performance",
        ],
        businessImpact: [
          "Fragmented content delivery hurt course completion and student satisfaction",
          "Manual enrollment management didn't scale past a handful of courses",
        ],
      },

      goals: [
        "Give instructors a structured course and lesson authoring experience",
        "Track student progress per lesson and per course",
        "Automate enrollment and access control",
        "Provide admins with platform-wide course and student analytics",
      ],

      solution: {
        title: "A structured LMS built around courses, lessons, and real progress",
        description:
          "We built E-learny around a clear course → module → lesson hierarchy, with automatic progress tracking, role-based dashboards for students, instructors, and admins, and a REST API designed for future mobile expansion.",
        highlights: [
          "Structured course, module, and lesson content model",
          "Automatic per-lesson and per-course progress tracking",
          "Role-based dashboards for students, instructors, and admins",
          "Firebase-backed authentication and enrollment management",
        ],
      },

      workflow: [
        {
          title: "Curriculum modeling",
          description:
            "Designed the course → module → lesson hierarchy with instructors to match how they actually structure curricula.",
        },
        {
          title: "Instructor authoring tools",
          description:
            "Built the course creation flow so instructors could publish and update content without developer help.",
        },
        {
          title: "Progress tracking engine",
          description:
            "Implemented per-lesson completion tracking that rolls up into course-level progress for students and instructors.",
        },
        {
          title: "Enrollment & access control",
          description:
            "Added Firebase-backed enrollment so access to paid courses is granted and revoked automatically.",
        },
        {
          title: "Admin analytics",
          description:
            "Shipped an admin dashboard summarizing enrollment, completion rates, and course performance platform-wide.",
        },
      ],

      architecture: [
        "Course → module → lesson content hierarchy",
        "Progress tracking engine rolling lesson completion into course status",
        "Role-based dashboards for student, instructor, and admin views",
        "REST API layer designed for future mobile client support",
      ],

      features: [
        "Structured course and lesson authoring for instructors",
        "Automatic progress tracking for students",
        "Role-based dashboards for students, instructors, and admins",
        "Automated enrollment and access control",
      ],

      uiHighlights: [
        "Clean course catalog with progress indicators",
        "Distraction-free lesson player with completion tracking",
        "Instructor dashboard summarizing enrollment and engagement",
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
        "Designing a content hierarchy flexible enough for varied course structures",
        "Rolling up granular lesson progress into accurate course-level completion",
        "Automating enrollment and access without manual admin intervention",
        "Keeping performance solid as course and student volume grew",
      ],

      solutionsImplemented: [
        "Built a flexible module/lesson schema that supports both linear and non-linear course structures",
        "Implemented weighted progress rollups so course completion reflects real lesson effort",
        "Tied enrollment status directly to Firebase Auth claims for automatic access control",
        "Indexed course and progress queries to keep dashboards responsive at scale",
      ],

      results: [
        "Instructors published fully structured courses without developer involvement",
        "Students could track progress accurately across every enrolled course",
        "Enrollment and access management became fully automated",
        "Admins gained platform-wide visibility into course performance for the first time",
      ],

      metrics: {
        performance: "94/100",
        seo: "93/100",
        accessibility: "95/100",
        bestPractices: "98/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Founder",
        company: "E-learny",
        quote:
          "We went from scattered videos and PDFs to a real learning platform. Instructors publish courses themselves, and for the first time we can actually see how students are progressing.",
        image: "/images/testimonials/customer-4.webp",
      },

      lessonsLearned: [
        "A flexible content hierarchy matters more upfront than any individual feature",
        "Weighted progress tracking builds far more trust than simple percentage counters",
        "Tying access control directly to auth claims removes an entire class of manual admin work",
      ],

      nextSteps: [
        "Add quizzes and certificates tied to course completion",
        "Introduce cohort-based live course scheduling",
        "Build a mobile app on top of the existing REST API",
      ],

      relatedProjects: ["teacher-world", "travel-agency-application"],
    },

    {
      id: "10",
      slug: "teacher-world",
      title: "Teacher World",
      shortTitle: "Teacher World",
      category: "Marketplace Platform",
      industry: "Education & Tutoring",
      client: "Teacher World",
      service: null,
      technologies: ["React.js", "React Router", "Bootstrap", "Node.js", "Express"],
      tools: ["Firebase Auth", "Firebase Firestore", "Netlify"],
      duration: "6 weeks",
      date: null,
      status: "Completed",
      liveUrl: null,

      thumbnail: "/images/project-thumbnails/thumbnail-10.webp",
      heroImage: "/images/project-thumbnails/thumbnail-10.webp",
      gallery: [
        "/images/projects/project-6.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-4.webp",
      ],

      overview:
        "Teacher World is a tutor marketplace that connects students with tutors through robust search and filtering, letting students book sessions directly instead of relying on manual referrals.",

      challenge: {
        title: "Finding and booking the right tutor took too many phone calls",
        description:
          "The client's tutoring service matched students to tutors manually over phone and email, a process that didn't scale and gave students no visibility into tutor availability, subjects, or ratings before committing.",
        painPoints: [
          "No searchable directory of tutors by subject, availability, or rating",
          "Booking a session required back-and-forth coordination by staff",
          "No self-serve way for tutors to manage their own availability",
          "Admins had no dashboard to oversee bookings across the platform",
        ],
        businessImpact: [
          "Manual matching limited how many students the service could onboard at once",
          "Students without visibility into tutor options were more likely to drop off before booking",
        ],
      },

      goals: [
        "Let students search and filter tutors by subject, availability, and rating",
        "Enable direct, self-serve session booking",
        "Give tutors control over their own availability and profile",
        "Provide admins a dashboard to oversee bookings platform-wide",
      ],

      solution: {
        title: "A self-serve marketplace connecting students directly to tutors",
        description:
          "We built a searchable tutor directory with rich filtering, a direct booking flow tied to tutor-managed availability, and an admin dashboard giving the platform full visibility into bookings and tutor activity.",
        highlights: [
          "Searchable tutor directory with subject, price, and rating filters",
          "Self-serve booking flow tied to tutor-managed availability",
          "Tutor dashboard for managing profile, subjects, and schedule",
          "Admin dashboard for platform-wide booking oversight",
        ],
      },

      workflow: [
        {
          title: "Marketplace structure",
          description:
            "Defined the tutor profile, availability, and booking data model to support direct, self-serve matching.",
        },
        {
          title: "Search & filtering",
          description:
            "Built the tutor directory with filtering by subject, price range, rating, and availability.",
        },
        {
          title: "Booking flow",
          description:
            "Implemented the booking flow, tying session requests directly to a tutor's live availability calendar.",
        },
        {
          title: "Tutor & admin dashboards",
          description:
            "Shipped a tutor dashboard for managing availability and profile, and an admin dashboard for platform oversight.",
        },
        {
          title: "QA & rollout",
          description:
            "Tested the full student-to-tutor booking journey end-to-end before rolling out to the client's existing tutor network.",
        },
      ],

      architecture: [
        "Tutor search and filter engine",
        "Booking and scheduling data model tied to tutor availability",
        "Role-based dashboards for students, tutors, and admins",
        "Firestore-backed tutor profile storage",
      ],

      features: [
        "Searchable tutor directory with subject and rating filters",
        "Self-serve session booking tied to tutor availability",
        "Tutor dashboard for managing profile and schedule",
        "Admin dashboard for platform-wide booking oversight",
      ],

      uiHighlights: [
        "Filterable tutor cards with ratings and subject tags at a glance",
        "Calendar-based booking flow showing real tutor availability",
        "Simple tutor onboarding and profile management flow",
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
        "Keeping tutor availability accurate in real time as bookings came in",
        "Designing filters specific enough to be useful without overwhelming students",
        "Giving tutors a self-serve dashboard simple enough to adopt without training",
        "Preventing double-booking of the same tutor slot",
      ],

      solutionsImplemented: [
        "Locked availability slots atomically at booking time to prevent double-booking",
        "Iterated filter design with real students to land on the most-used criteria",
        "Designed a minimal, guided tutor onboarding flow with sensible defaults",
        "Synced tutor calendars in real time using Firestore listeners",
      ],

      results: [
        "Students booked tutors directly without staff coordination",
        "Tutor onboarding time dropped significantly with the self-serve dashboard",
        "Eliminated double-booking incidents after the atomic slot-locking fix",
        "Admins gained full visibility into platform-wide bookings",
      ],

      metrics: {
        performance: "93/100",
        seo: "92/100",
        accessibility: "94/100",
        bestPractices: "97/100",
      },

      testimonial: {
        name: "Confidential",
        role: "Program Director",
        company: "Teacher World",
        quote:
          "Students book tutors themselves now, and our tutors manage their own schedules. It freed our staff from coordination work and let us grow past what manual matching could ever support.",
        image: "/images/testimonials/customer-5.webp",
      },

      lessonsLearned: [
        "Atomic slot-locking is essential wherever two-sided marketplaces handle scheduling",
        "Filter design should follow real user search behavior, not assumptions",
        "Self-serve dashboards succeed when onboarding defaults do most of the work",
      ],

      nextSteps: [
        "Add integrated video sessions for remote tutoring",
        "Introduce a review and rating system post-session",
        "Build recommendation logic to suggest tutors based on past bookings",
      ],

      relatedProjects: ["e-learny-platform", "apartment-selling-site"],
    },

    {
      id: "11",
      slug: "karially",
      title: "Karially",
      shortTitle: "Karially",
      category: "AI Platform",
      industry: "Career Technology",
      client: "Karially",
      service: "AI Product Design, Web App Development",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "OpenAI"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://karially.com/",

      thumbnail: "/images/project-thumbnails/thumbnail-1.webp",
      heroImage: "/images/project-thumbnails/thumbnail-1.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "Your AI-powered career plan isn't generic advice; it's your personalized weekly blueprint. Answer our smart assessment and get a clear roadmap with specific milestones tailored to your goals, timeline, and current situation.",

      challenge: {
        title: null,
        description:
          "Professionals were overwhelmed by scattered career resources and generic advice that failed to adapt to their unique goals, leaving ambitious talent without a clear path to grow.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Guide every career journey with intelligent, personalized tools",
        description:
          "We built an AI-powered platform that learns from each user's goals and habits, then curates a learning path, career roadmap and productivity toolkit that evolves with them — turning generic advice into guidance that actually fits.",
        highlights: [
          "Product Strategy",
          "UX/UI Design",
          "AI Integration",
          "Front-end Development",
          "Design System",
        ],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "12",
      slug: "luxeb2b",
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

      thumbnail: "/images/project-thumbnails/thumbnail-2.webp",
      heroImage: "/images/project-thumbnails/thumbnail-2.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A premium B2B marketplace connecting global buyers and suppliers in the luxury fragrance and beauty industry.",

      challenge: {
        title: null,
        description:
          "Global buyers and suppliers in the luxury fragrance industry lacked a trusted digital marketplace, relying instead on fragmented trade shows and manual negotiations that slowed every deal.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Connect a global luxury trade on one premium marketplace",
        description:
          "We designed and built a B2B marketplace that brings verified buyers and suppliers together with streamlined sourcing, negotiation and order management — packaged in an experience that matches the prestige of the products themselves.",
        highlights: [
          "Marketplace UX",
          "Front-end Development",
          "Vendor Onboarding Flows",
          "Brand Identity",
        ],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "13",
      slug: "ach-gold-estates",
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

      thumbnail: "/images/project-thumbnails/thumbnail-3.webp",
      heroImage: "/images/project-thumbnails/thumbnail-3.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A modern real estate platform providing premium property listings and student accommodation solutions with a seamless browsing experience.",

      challenge: {
        title: null,
        description:
          "Prospective tenants and buyers struggled to find accurate, up-to-date property listings, forcing the agency's team to manually field repetitive inquiries instead of closing deals.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

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

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "14",
      slug: "c-smith",
      title: "C Smith",
      shortTitle: "C Smith",
      category: "Portfolio",
      industry: "Personal Branding",
      client: "C Smith",
      service: "Portfolio Website, Motion Design",
      technologies: ["Next.js", "GSAP", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2024",
      status: null,
      liveUrl: "https://csmith-rho.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-4.webp",
      heroImage: "/images/project-thumbnails/thumbnail-4.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A clean and elegant portfolio website showcasing professional experience, creative work, and personal branding.",

      challenge: {
        title: null,
        description:
          "A talented professional's work was scattered across PDFs and social posts, with no single place that reflected the quality and personality behind it.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Give a career-defining body of work a home worth visiting",
        description:
          "We crafted a clean, elegant portfolio with considered typography and subtle motion that lets the work lead — turning a simple site visit into a lasting impression.",
        highlights: ["Portfolio Design", "GSAP Animation", "Front-end Development"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "15",
      slug: "big-fish",
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
      liveUrl: "https://bigfish-omega.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-5.webp",
      heroImage: "/images/project-thumbnails/thumbnail-5.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
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

      goals: [],

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

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "16",
      slug: "james-orpin",
      title: "James Orpin",
      shortTitle: "James Orpin",
      category: "Portfolio",
      industry: "Professional Services",
      client: "James Orpin",
      service: "Portfolio Website, Brand Presentation",
      technologies: ["React", "Tailwind CSS", "GSAP"],
      tools: [],
      duration: null,
      date: "2023",
      status: null,
      liveUrl: "https://james-orpin-beta.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-6.webp",
      heroImage: "/images/project-thumbnails/thumbnail-6.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A premium portfolio website crafted to highlight expertise, featured projects, and professional achievements.",

      challenge: {
        title: null,
        description:
          "Featured projects and hard-earned achievements were buried in a resume format that undersold the expertise behind them.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Present a career of results with the polish it deserves",
        description:
          "We designed a premium portfolio that foregrounds featured projects and measurable outcomes, giving visitors a confident, at-a-glance read on the expertise on offer.",
        highlights: ["UX/UI Design", "Front-end Development", "GSAP Animation"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "17",
      slug: "powernest",
      title: "PowerNest",
      shortTitle: "PowerNest",
      category: "Business",
      industry: "Business Solutions",
      client: "PowerNest",
      service: "Corporate Website, Content Strategy",
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
        "A modern corporate website focused on showcasing innovative services, business solutions, and company values.",

      challenge: {
        title: null,
        description:
          "The company's innovative services and business solutions were hard to explain through a generic, template-driven website that didn't reflect their actual value proposition.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Make a strong business case in the first ten seconds",
        description:
          "We rebuilt the corporate site around a clear service narrative and structured content, giving prospective clients a fast, credible understanding of what PowerNest delivers and why it matters.",
        highlights: ["Web Development", "Content Strategy", "UX/UI Design"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "18",
      slug: "briataor-paint",
      title: "Briataor Paint",
      shortTitle: "Briataor Paint",
      category: "Business",
      industry: "Consumer Goods",
      client: "Briataor Paint",
      service: "Brand Website, Product Showcase",
      technologies: ["Next.js", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2023",
      status: null,
      liveUrl: "https://briataor-paint.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-8.webp",
      heroImage: "/images/project-thumbnails/thumbnail-8.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A visually engaging brand website designed to promote products, strengthen brand identity, and improve customer engagement.",

      challenge: {
        title: null,
        description:
          "The brand's product range and identity weren't translating online, leaving customers with little reason to engage beyond a basic catalog page.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Bring a bold brand identity to life online",
        description:
          "We built a visually engaging site that puts the product line and brand story front and center, driving stronger engagement and a clearer sense of who the brand is.",
        highlights: ["Brand Website Design", "Front-end Development", "Product Showcase UX"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "19",
      slug: "yachtease",
      title: "YachtEase",
      shortTitle: "YachtEase",
      category: "Travel",
      industry: "Luxury Travel & Charter",
      client: "YachtEase",
      service: "Booking Platform, Luxury UX",
      technologies: ["Next.js", "Booking System", "Tailwind CSS"],
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
        "A premium yacht booking platform delivering an elegant user experience for luxury travel and charter services.",

      challenge: {
        title: null,
        description:
          "Booking a yacht charter meant emails and phone calls back and forth, a process that felt at odds with the seamless luxury experience guests expected.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Make booking a charter as effortless as the trip itself",
        description:
          "We designed and built an elegant booking platform with real-time availability and a guided reservation flow, turning a manual, multi-step process into a few effortless clicks.",
        highlights: ["Booking System Development", "UX/UI Design", "Front-end Development"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
    },

    {
      id: "20",
      slug: "davorron-martis",
      title: "Davorron Martis",
      shortTitle: "Davorron Martis",
      category: "Portfolio",
      industry: "Creative Design",
      client: "Davorron Martis",
      service: "Creative Portfolio, Design Storytelling",
      technologies: ["Next.js", "GSAP", "Tailwind CSS"],
      tools: [],
      duration: null,
      date: "2023",
      status: null,
      liveUrl: "https://davorron-martisnew.vercel.app/",

      thumbnail: "/images/project-thumbnails/thumbnail-10.webp",
      heroImage: "/images/project-thumbnails/thumbnail-10.webp",
      gallery: [
        "/images/projects/project-1.webp",
        "/images/projects/project-2.webp",
        "/images/projects/project-3.webp",
        "/images/projects/project-4.webp",
        "/images/projects/project-5.webp",
        "/images/projects/project-6.webp",
      ],

      overview:
        "A bold and visually refined portfolio website featuring creative projects, professional background, and design-focused storytelling.",

      challenge: {
        title: null,
        description:
          "A bold creative practice needed a portfolio that matched its visual ambition instead of a generic template that flattened every project into the same layout.",
        painPoints: [],
        businessImpact: [],
      },

      goals: [],

      solution: {
        title: "Design a portfolio as distinctive as the work inside it",
        description:
          "We created a bold, design-forward portfolio with custom layouts and motion for each project, letting the creative background and storytelling come through as strongly online as it does in person.",
        highlights: ["Portfolio Design", "GSAP Animation", "Front-end Development"],
      },

      workflow: [],
      architecture: [],
      features: [],
      uiHighlights: [],
      developmentProcess: [],
      challengesFaced: [],
      solutionsImplemented: [],
      results: [],
      metrics: null,
      testimonial: null,
      lessonsLearned: [],
      nextSteps: [],
      relatedProjects: [],
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
