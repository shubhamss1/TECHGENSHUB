# TECHGENSHUB Creator Toolkit

Next.js (App Router) + TypeScript + Tailwind CSS 3. Milestone 1: homepage, tool directory, Instagram Bio Generator.

## Install and run

Requires Node.js 18.18 or newer (Node 20 or 22 recommended).

```bash
cd techgenshub-creator-toolkit
npm install
npm run dev          # http://localhost:3000
```

## Verify before deploying

```bash
npm run typecheck    # tsc --noEmit
npm test             # bio generator unit tests
npm run build        # production build
npm start            # serve the production build locally
npm run check        # all of the above in one command
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repo. Framework is auto-detected as Next.js; no build settings to change.
3. Optional: add the environment variable `NEXT_PUBLIC_SITE_URL` (your production URL). It is public metadata, not a secret.

No API keys or secrets are used anywhere in this milestone.

## Structure

```
app/                    routes (/, /tools, /tools/[slug], /pricing, /about, 404)
components/             Header, Footer, Hero, ToolCard, ToolDirectory, Icon, SectionHeading
components/tools/       interactive tools + index.ts (slug → component map)
lib/bio-generator.ts    pure, tested template engine (no network)
lib/tools.ts            tool registry + search/filter
tests/                  unit tests (run with tsx)
```

## Adding a new tool

1. Add an entry to `lib/tools.ts` (set `status: "live"`).
2. Create the component in `components/tools/` and register its slug in `components/tools/index.ts`.
