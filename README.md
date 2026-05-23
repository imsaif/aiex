# AI UX Audit Tool

**[aiuxdesign.guide](https://aiuxdesign.guide)** — Upload a screenshot of your AI product. Get a graded report on what's working, what's missing, and what to ship next — scored against 36 research-backed AI UX patterns.

## What the audit does

Drop a screenshot (chat thread, agent surface, AI-powered feature) into the audit tool. The pipeline returns:

- **A score out of the patterns that apply to your surface** (typically 3–8 out of 36 — most surfaces don't meaningfully invoke all 36)
- **Top gaps**, ranked by severity, each with cited visible evidence from the screenshot
- **A consolidated handoff prompt** you can paste into Claude Code, Cursor, or another coding assistant — it locates the affected files in your repo and applies the patterns
- **Per-gap pattern links** for designers who want to go deep on one issue

The audit is free, no signup required for the first run.

## How the grading works

The audit is run by Claude (Sonnet, `temperature: 0`) against a structured prompt that encodes all 36 patterns. The process is intentionally **evidence-first, not pattern-first** — earlier versions that led with "check pattern X" produced fabricated findings on surfaces where pattern X didn't apply. Current methodology, in order:

1. **Describe each surface.** Identify what specifically is shown (e.g., "Claude chat thread mid-conversation", "Settings → Usage page"). Inventory the visible interactive controls. This list anchors every later "X is missing" claim — if a control wasn't in the inventory, claiming it's absent is hallucination.
2. **Select applicable patterns** (max 8). From the 36-pattern library, list only the patterns that meaningfully apply to *this specific surface*. A billing page does not need Confidence Visualization; a chat thread does. Most surfaces invoke 3–7 patterns, not 20. Padding destroys trust in the audit, so the prompt has a hard cap.
3. **Evaluate only the applicable patterns.** For each one, decide whether the surface implements it. Every finding must include an `evidence` field that cites a specific visible UI element ("no thumbs-up/down on AI messages in the message list"). Findings without specific evidence get dropped — they are not invented.
4. **Rank gaps + propose actions.** Each gap gets a severity (critical / high / medium / low) and a "what to ship" suggestion grounded in the pattern's install guidance.

The honest-fallback case matters as much as the happy path: if the screenshot isn't an AI product surface (e.g., a marketing page, a non-AI billing screen), the audit returns 0 applicable patterns and a useful empty-state explanation — not 8 fabricated gaps.

## The 36 patterns powering the audit

The pattern library is the methodology — open source, with interactive demos and install prompts for each. Patterns are organized across 8 categories:

| Category | Patterns | Examples |
|----------|----------|----------|
| Human-AI Collaboration | 10 | Autonomy Spectrum, Intent Preview, Human-in-the-Loop |
| Trustworthy & Reliable AI | 8 | Trust Calibration, Explainable AI, Safe Exploration |
| Adaptive & Intelligent Systems | 4 | Adaptive Interfaces, Ambient Intelligence |
| Natural Interaction | 4 | Conversational UI, Progressive Disclosure |
| Safety & Harm Prevention | 4 | Crisis Detection, Vulnerable User Protection |
| Performance & Efficiency | 3 | Intelligent Caching, Agent Status Monitoring |
| Privacy & Control | 2 | Privacy-First Design, Selective Memory |
| Accessibility & Inclusion | 1 | Universal Access Patterns |

Each pattern page includes: an opinionated judgment call ("use it when / don't when / the trap"), 4 ranked takeaways, real-world examples from shipped products, an interactive demo, and an "install with Claude Code" prompt that drops the pattern into your codebase.

## Also at aiuxdesign.guide

- **Designer Guides** — structured learning paths covering AI UX topics
- **Daily Newsletter** — curated AI UX news; pattern-tagged so updates surface relevant changes to the library
- **Prompt Library** — reusable prompts for AI-powered design workflows

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL on Neon (Prisma ORM) |
| AI | Claude API (Anthropic SDK) — Sonnet for audit, Haiku for newsletter |
| Email | Resend (transactional) + Beehiiv (newsletter delivery) |
| Analytics | Microsoft Clarity, Vercel Speed Insights |
| Deployment | Vercel |

## Getting Started

```bash
git clone https://github.com/imsaif/aiex.git
cd aiex
npm install
cp .env.example .env.local  # configure environment variables
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

See `.env.example` for the full list. At minimum:

- `DATABASE_URL` — PostgreSQL connection string
- `ANTHROPIC_API_KEY` — for audit, mentor, and newsletter generation
- `RESEND_API_KEY` — for transactional email
- `BEEHIIV_API_KEY` + `BEEHIIV_PUBLICATION_ID` — for newsletter subscriber sync

## Development

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run tests
npm run test:coverage # Tests with coverage report
```

## Contributing

Contributions welcome — new patterns, improvements to existing ones, audit prompt refinements, bug fixes, docs. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).

## Contact

- Website: [aiuxdesign.guide](https://aiuxdesign.guide)
- GitHub: [@imsaif](https://github.com/imsaif)
