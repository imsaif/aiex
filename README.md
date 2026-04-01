# AI UX Design Patterns

**[aiuxdesign.guide](https://aiuxdesign.guide)** — A comprehensive reference of 36 AI design patterns for building intuitive, ethical, and effective AI-powered interfaces.

## What's Inside

- **36 AI design patterns** across 8 categories, each with interactive demos, code examples, and design guidance
- **AI UX Audit Tool** — upload screenshots and get pattern-based feedback on your AI product's UX
- **Designer Guides** — structured learning paths for AI UX topics
- **Prompt Library** — reusable prompts for AI-powered design workflows
- **Weekly Newsletter** — curated AI UX news delivered to subscribers

## Pattern Categories

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

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL (Prisma ORM) |
| AI | Claude API (Anthropic SDK) |
| Email | Resend + Beehiiv |
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

See `.env.example` for required variables. At minimum you need:
- `DATABASE_URL` — PostgreSQL connection string
- `ANTHROPIC_API_KEY` — for AI-powered features (audit, mentor)
- `RESEND_API_KEY` — for email/newsletter functionality

## Development

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm test             # Run tests
npm run test:coverage # Tests with coverage report
```

## Contributing

We welcome contributions from designers, developers, and writers. Whether it's submitting a new pattern, improving an existing one, fixing bugs, or writing docs — see [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get started.

## License

MIT — see [LICENSE](./LICENSE).

## Contact

- Website: [aiuxdesign.guide](https://aiuxdesign.guide)
- GitHub: [@imsaif](https://github.com/imsaif)
