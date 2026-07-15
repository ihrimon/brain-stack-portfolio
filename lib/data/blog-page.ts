export type BlogContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "imageGrid"; images: { src: string; alt: string }[] }
  | { type: "sideBySide"; image: { src: string; alt: string }; text: string }

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  comments: number
  publishDate: string
  featuredImage: string
  tags: string[]
  content: BlogContentBlock[]
}

const images = [
  "/images/blog/blog-1.webp",
  "/images/blog/blog-2.webp",
  "/images/blog/blog-3.webp",
  "/images/blog/blog-4.webp",
]

export const blogsData = {
  badge: "Blog Insights",
  title: "Explore Our Thoughts on Technology and Innovation",

  posts: [
    {
      slug: "why-ai-assisted-development-is-the-new-baseline",
      title: "Why AI-Assisted Development Is the New Baseline",
      excerpt:
        "How LLM-powered tooling is changing what a senior engineering team can ship in a single sprint — and what it means for your roadmap.",
      category: "AI & Engineering",
      author: "John Smith",
      comments: 4,
      publishDate: "2026-05-12",
      featuredImage: "/images/blog/blog-1.webp",
      tags: ["AI", "Engineering"],
      content: [
        {
          type: "paragraph",
          text: "Two years ago, AI-assisted coding was a novelty senior engineers used to draft boilerplate. Today it's load-bearing infrastructure in how serious teams ship product — and the gap between teams that have adapted and teams that haven't is widening fast.",
        },
        { type: "heading", text: "What Changed" },
        {
          type: "paragraph",
          text: "Modern coding agents can hold an entire codebase's context, reason about architecture, and execute multi-step refactors with minimal supervision. That shifts the senior engineer's job from writing every line to reviewing, directing, and catching the 10% an agent gets wrong.",
        },
        {
          type: "list",
          items: [
            "Faster first drafts on well-scoped features",
            "More time spent on architecture and code review",
            "New failure modes: confident but wrong output",
            "A widening skills gap between AI-fluent and AI-resistant teams",
          ],
        },
        { type: "heading", text: "Where Teams Get It Wrong" },
        {
          type: "paragraph",
          text: "The failure mode we see most often isn't under-adoption — it's treating AI output as finished work instead of a first draft. Teams that skip review because the code 'looks right' end up debugging subtler, more expensive bugs later.",
        },
        {
          type: "paragraph",
          text: "Our engineers treat every AI-generated diff the way they'd treat a junior developer's pull request: useful, fast, and still requiring a second pair of eyes before it ships.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "choosing-between-mvp-and-full-product-build",
      title: "MVP or Full Build? How to Choose",
      excerpt:
        "A practical framework for deciding how much product to build before your first real users touch it.",
      category: "Product Strategy",
      author: "John Smith",
      comments: 4,
      publishDate: "2026-04-03",
      featuredImage: "/images/blog/blog-2.webp",
      tags: ["Product Strategy", "MVP"],
      content: [
        {
          type: "paragraph",
          text: "The MVP-vs-full-build decision gets made too early and too emotionally — founders either want to ship something in two weeks or refuse to launch until it's 'done.' Neither instinct is a strategy.",
        },
        { type: "heading", text: "The Real Question" },
        {
          type: "paragraph",
          text: "It's not 'how small can we make this,' it's 'what's the smallest thing that lets us learn something we don't already know?' If you already know the answer, you don't need an MVP — you need to build the real thing.",
        },
        {
          type: "sideBySide",
          image: { src: images[2], alt: "Team reviewing a product roadmap" },
          text: "We've seen founders spend six months validating assumptions their own customer interviews had already answered. An MVP that tests a known truth is wasted engineering time, not lean process.",
        },
        { type: "heading", text: "A Framework That Works" },
        {
          type: "list",
          items: [
            "Name the specific assumption you're testing",
            "Define the metric that would prove or disprove it",
            "Build only what's needed to measure that metric",
            "Set a hard decision date before you start",
          ],
        },
        {
          type: "paragraph",
          text: "Everything else — polish, edge cases, scale — comes after the assumption is validated, not before.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "scaling-a-saas-platform-past-your-first-100-customers",
      title: "Scaling a SaaS Platform Past Your First 100 Customers",
      excerpt:
        "The architecture decisions that matter once your product stops being a prototype and starts being infrastructure.",
      category: "SaaS Engineering",
      author: "John Smith",
      comments: 4,
      publishDate: "2026-02-20",
      featuredImage: "/images/blog/blog-3.webp",
      tags: ["SaaS", "Architecture"],
      content: [
        {
          type: "paragraph",
          text: "The architecture that gets you to 100 customers is rarely the one that gets you to 1,000. Most of the pain we see isn't from bad code — it's from decisions that were correct at the time and never revisited.",
        },
        { type: "heading", text: "The First Wall" },
        {
          type: "paragraph",
          text: "Single-tenant assumptions baked into a database schema, synchronous jobs that block the request thread, and auth logic scattered across a dozen route handlers — these all work fine at low volume and fail loudly once real usage arrives.",
        },
        {
          type: "imageGrid",
          images: [
            { src: images[0], alt: "Engineers pairing on an architecture diagram" },
            { src: images[3], alt: "Dashboard showing platform metrics" },
          ],
        },
        { type: "heading", text: "What to Fix First" },
        {
          type: "list",
          items: [
            "Move long-running work off the request/response cycle",
            "Add proper multi-tenancy before it's a migration project",
            "Centralize auth and permissions into one layer",
            "Instrument before you optimize — measure, don't guess",
          ],
        },
        {
          type: "paragraph",
          text: "None of this requires a rewrite. It requires treating your first 100 customers as a signal to revisit assumptions, not a finish line.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "choosing-the-best-work-to-feature-in-your-portfolio",
      title: "How to Choose the Best Work to Feature in Your Portfolio",
      excerpt:
        "A practical filter for deciding which case studies actually earn their place in front of new clients.",
      category: "Consulting",
      author: "John Smith",
      comments: 4,
      publishDate: "2026-01-09",
      featuredImage: "/images/blog/blog-4.webp",
      tags: ["Consulting", "Portfolio"],
      content: [
        {
          type: "paragraph",
          text: "Every agency site has a portfolio page. Very few have a good one — because most treat it as an archive instead of an argument for why a prospective client should choose them.",
        },
        { type: "heading", text: "The Filter We Use" },
        {
          type: "paragraph",
          text: "A project earns a place in the portfolio if it demonstrates a decision, not just a deliverable. 'We built a website' isn't a case study. 'We cut checkout abandonment by rebuilding a three-step flow into one' is.",
        },
        {
          type: "list",
          items: [
            "Does it show a specific problem, not just a pretty output?",
            "Would a prospect in a similar situation recognize themselves in it?",
            "Is there a measurable outcome, even a modest one?",
            "Does it represent the kind of work you want more of?",
          ],
        },
        { type: "heading", text: "Curate, Don't Catalog" },
        {
          type: "paragraph",
          text: "Six strong case studies outperform twenty thin ones. If a project doesn't pass the filter, it belongs in an internal archive, not the page a new client judges you by.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "the-real-cost-of-technical-debt-in-fast-growing-startups",
      title: "The Real Cost of Technical Debt in Fast-Growing Startups",
      excerpt:
        "Why the shortcuts that get you to launch are rarely the ones that should still be in production a year later.",
      category: "Engineering",
      author: "Sarah Chen",
      comments: 6,
      publishDate: "2025-12-18",
      featuredImage: "/images/blog/blog-1.webp",
      tags: ["Engineering", "Startups"],
      content: [
        {
          type: "paragraph",
          text: "Technical debt isn't inherently bad — taking a shortcut to hit a launch date is often the right call. The cost shows up later, when nobody remembers why the shortcut was taken or what it was supposed to unblock.",
        },
        { type: "heading", text: "Debt Compounds Quietly" },
        {
          type: "paragraph",
          text: "A skipped test suite doesn't slow you down in week one. It slows you down in month eight, when every new feature requires manually re-testing the same five flows because nobody trusts the code enough to touch it without checking.",
        },
        {
          type: "sideBySide",
          image: { src: images[1], alt: "Developer reviewing legacy code" },
          text: "We've inherited codebases where the 'temporary' auth workaround from launch week was still load-bearing three years and four engineering hires later — because nobody wrote down that it was temporary.",
        },
        { type: "heading", text: "How We Manage It" },
        {
          type: "list",
          items: [
            "Tag intentional shortcuts in code, not just memory",
            "Revisit debt on a cadence, not only when it breaks",
            "Pay down debt that blocks velocity before debt that's merely ugly",
          ],
        },
        {
          type: "paragraph",
          text: "The goal isn't zero debt. It's debt you chose on purpose and can still see.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "designing-onboarding-flows-that-dont-lose-users",
      title: "Designing Onboarding Flows That Don't Lose Users",
      excerpt:
        "The small friction points that quietly kill activation rates — and how we test for them before shipping.",
      category: "Product Design",
      author: "Marcus Lee",
      comments: 3,
      publishDate: "2025-11-22",
      featuredImage: "/images/blog/blog-2.webp",
      tags: ["Product Design", "UX"],
      content: [
        {
          type: "paragraph",
          text: "Most onboarding drop-off isn't caused by one big mistake — it's death by a hundred small frictions, each one small enough to seem harmless in a design review.",
        },
        { type: "heading", text: "Where Users Actually Quit" },
        {
          type: "paragraph",
          text: "Session recordings consistently show the same pattern: users don't abandon at the hardest step, they abandon at the step where the value isn't clear yet. If someone can't answer 'why am I doing this' in under three seconds, they leave.",
        },
        {
          type: "list",
          items: [
            "Delay account creation until after the first 'aha' moment",
            "Cut required fields to what's truly required",
            "Show progress, not just steps remaining",
            "Test onboarding with users who've never seen the product",
          ],
        },
        { type: "heading", text: "Testing Before Shipping" },
        {
          type: "paragraph",
          text: "We run every onboarding flow through five-minute unmoderated tests before launch. It's cheap, it's fast, and it catches the friction points a design review always misses.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "what-we-learned-shipping-ai-agents-into-production",
      title: "What We Learned Shipping AI Agents Into Production",
      excerpt:
        "The gap between a working demo and a reliable agent your team can trust — and how to close it.",
      category: "AI & Engineering",
      author: "John Smith",
      comments: 8,
      publishDate: "2025-10-05",
      featuredImage: "/images/blog/blog-3.webp",
      tags: ["AI", "Production Engineering"],
      content: [
        {
          type: "paragraph",
          text: "A demo that works once is easy. An agent your team trusts to run unattended, every day, without surprising anyone — that's a different engineering problem entirely.",
        },
        { type: "heading", text: "The Demo-to-Production Gap" },
        {
          type: "paragraph",
          text: "Demos are forgiving: you pick the happy path, you're watching closely, and a weird output is a curiosity, not an incident. Production has none of that grace. The same agent needs guardrails, logging, and a fallback for every step that can fail.",
        },
        {
          type: "imageGrid",
          images: [
            { src: images[2], alt: "Monitoring dashboard for an AI agent" },
            { src: images[0], alt: "Engineer reviewing agent logs" },
          ],
        },
        { type: "heading", text: "What Actually Closes the Gap" },
        {
          type: "list",
          items: [
            "Constrain the agent's action space — fewer tools, tighter scopes",
            "Log every decision, not just the final output",
            "Build a human-review path for low-confidence actions",
            "Treat prompt changes like code changes: reviewed and versioned",
          ],
        },
        {
          type: "paragraph",
          text: "Reliability came less from a smarter model and more from boring, disciplined engineering around it.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "a-founders-guide-to-picking-a-tech-stack-in-2026",
      title: "A Founder's Guide to Picking a Tech Stack in 2026",
      excerpt:
        "Fewer frameworks, more leverage — the stack decisions that still matter once the hype cycle moves on.",
      category: "Product Strategy",
      author: "Sarah Chen",
      comments: 5,
      publishDate: "2025-09-14",
      featuredImage: "/images/blog/blog-4.webp",
      tags: ["Product Strategy", "Engineering"],
      content: [
        {
          type: "paragraph",
          text: "Founders spend more time debating frameworks than the decision deserves. In almost every case, the stack matters less than the team's familiarity with it and the constraints of what you're building.",
        },
        { type: "heading", text: "Questions That Actually Matter" },
        {
          type: "list",
          items: [
            "Who's going to maintain this in year two — you or a hired team?",
            "Does the product need real-time features, or is that premature?",
            "What's your actual scale requirement, not your hoped-for one?",
            "How fast can you hire for this stack if you need to?",
          ],
        },
        { type: "heading", text: "Our Default Recommendation" },
        {
          type: "paragraph",
          text: "Absent a strong reason otherwise, we default to Next.js, a managed Postgres database, and a boring, well-documented auth provider. Boring is a feature — it means more of your time goes into the product, not the plumbing.",
        },
        {
          type: "paragraph",
          text: "The stack that lets you ship this quarter beats the stack that's theoretically correct for a scale you haven't reached yet.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "why-we-moved-to-a-design-system-first-workflow",
      title: "Why We Moved to a Design-System-First Workflow",
      excerpt:
        "Shipping consistent product faster starts with fewer one-off components, not more designers.",
      category: "Design Systems",
      author: "Marcus Lee",
      comments: 2,
      publishDate: "2025-08-01",
      featuredImage: "/images/blog/blog-1.webp",
      tags: ["Design Systems", "Product Design"],
      content: [
        {
          type: "paragraph",
          text: "For years we designed screens first and extracted patterns later. It worked, until it didn't — every new feature meant re-deciding things that should have already been settled.",
        },
        { type: "heading", text: "The Cost of One-Off Components" },
        {
          type: "paragraph",
          text: "A button built for one screen becomes three slightly different buttons across the product within a quarter. Nobody decided that on purpose; it's just what happens when every screen is designed in isolation.",
        },
        {
          type: "sideBySide",
          image: { src: images[3], alt: "Design system component library" },
          text: "Moving to a design-system-first workflow meant slower first weeks and faster every week after. Once the primitives existed, new features became assembly, not invention.",
        },
        { type: "heading", text: "What We'd Tell a Team Starting Today" },
        {
          type: "list",
          items: [
            "Build the system alongside your first real feature, not before it",
            "Version components like you version code",
            "Give designers and engineers shared ownership of the system",
          ],
        },
        {
          type: "paragraph",
          text: "A design system isn't a deliverable you finish. It's the codebase's memory for decisions you don't want to make twice.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "performance-budgets-that-actually-survive-launch-day",
      title: "Performance Budgets That Actually Survive Launch Day",
      excerpt:
        "Setting speed targets is easy. Keeping a team honest to them six sprints later is the hard part.",
      category: "Engineering",
      author: "John Smith",
      comments: 4,
      publishDate: "2025-06-27",
      featuredImage: "/images/blog/blog-2.webp",
      tags: ["Engineering", "Performance"],
      content: [
        {
          type: "paragraph",
          text: "Setting a performance budget in a kickoff meeting is easy. Keeping a team honest to it six sprints later, under deadline pressure, is where most budgets quietly die.",
        },
        { type: "heading", text: "Why Budgets Slip" },
        {
          type: "paragraph",
          text: "The first regression is always 'just this once' — one heavy dependency, one unoptimized image, one extra API call on the critical path. None of them alone breaks the budget. All of them together do.",
        },
        {
          type: "list",
          items: [
            "Enforce budgets in CI, not in a quarterly review",
            "Fail the build, don't just flag a warning",
            "Review the budget itself as the product evolves",
            "Make performance a launch criterion, not a fast-follow",
          ],
        },
        { type: "heading", text: "What Actually Works" },
        {
          type: "paragraph",
          text: "The teams that hold their budgets are the ones that made violating them inconvenient — a failed check, not a Slack message someone can ignore.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "how-we-run-discovery-before-writing-a-single-line-of-code",
      title: "How We Run Discovery Before Writing a Single Line of Code",
      excerpt:
        "The two-week process that saves months of building the wrong thing.",
      category: "Product Strategy",
      author: "Sarah Chen",
      comments: 7,
      publishDate: "2025-05-11",
      featuredImage: "/images/blog/blog-3.webp",
      tags: ["Product Strategy", "Discovery"],
      content: [
        {
          type: "paragraph",
          text: "The projects that go smoothly almost always share one thing in common: two weeks spent in discovery before anyone opened an editor.",
        },
        { type: "heading", text: "What Discovery Actually Covers" },
        {
          type: "list",
          items: [
            "Who the product is really for, specifically",
            "What they're doing today instead of using this",
            "The one metric that would prove the product is working",
            "The constraints — budget, timeline, team — that shape every decision after",
          ],
        },
        { type: "heading", text: "Why It's Worth the Delay" },
        {
          type: "paragraph",
          text: "Two weeks feels slow when a founder wants to see progress. It's fast compared to the alternative: three months of building the wrong thing well.",
        },
        {
          type: "sideBySide",
          image: { src: images[1], alt: "Discovery workshop notes on a whiteboard" },
          text: "Discovery isn't a report nobody reads. It's the document every design and engineering decision gets checked against for the rest of the project.",
        },
      ] satisfies BlogContentBlock[],
    },
    {
      slug: "remote-first-engineering-teams-what-actually-works",
      title: "Remote-First Engineering Teams: What Actually Works",
      excerpt:
        "Async by default, meetings by exception — the operating rhythm behind shipping across three continents.",
      category: "Team & Culture",
      author: "Marcus Lee",
      comments: 3,
      publishDate: "2025-03-30",
      featuredImage: "/images/blog/blog-4.webp",
      tags: ["Team & Culture", "Remote Work"],
      content: [
        {
          type: "paragraph",
          text: "We've shipped product across three continents without a shared office, and the operating rhythm that makes it work has almost nothing to do with tools and everything to do with defaults.",
        },
        { type: "heading", text: "Async by Default" },
        {
          type: "paragraph",
          text: "Every decision gets written down before it's discussed live. That single habit removes most of the timezone tax — nobody's blocked waiting for a meeting that's twelve hours away.",
        },
        {
          type: "list",
          items: [
            "Write the context before you request a sync",
            "Default to async; earn the meeting",
            "Document decisions where the whole team can find them later",
            "Protect deep-work blocks as seriously as meetings",
          ],
        },
        { type: "heading", text: "Meetings by Exception" },
        {
          type: "paragraph",
          text: "We hold a meeting when a written thread has stalled or a decision genuinely needs real-time back-and-forth — never as the default way to communicate.",
        },
      ] satisfies BlogContentBlock[],
    },
  ] satisfies BlogPost[],
} as const
