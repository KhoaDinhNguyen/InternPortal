# InternPortal

Intern portal for LalaForever. One place for interns and the team to see announcements, to-dos,
hours, calendar events, direct messages, shared docs, quick links and tickets, plus profiles and
admin tools.

> **Prototype status:** there is no real backend yet. Sign-in, users and requests are mocked and
> saved in your browser's `localStorage`, and most feature data comes from mock files. Don't put
> real personal data in it. See [PROJECT_STATUS_HANDOFF.md](PROJECT_STATUS_HANDOFF.md) for details
> and the roadmap.

## Tech stack

- React 19 + TypeScript 6
- Vite 8 (with the React Compiler)
- React Router 7
- Tailwind CSS 4
- Deployed on Vercel

## Getting started

### Requirements

- [Node.js](https://nodejs.org/) **20.19+** or **22.12+** (Vite 8 needs one of these)
- npm (comes with Node)

Check your version with `node -v`.

### Run locally

The app lives in the `app/` folder, so run every command from there.

```bash
git clone https://github.com/KhoaDinhNguyen/CSE360-TeamProject.git
cd InternPortal/app
npm install
npm run dev
```

Open the URL Vite prints (usually <http://localhost:5173>) and sign in with a demo account below.
No `.env` file is needed yet.

### Demo accounts

| Email              | Password   | Role      | What to try                                                      |
| ------------------ | ---------- | --------- | ---------------------------------------------------------------- |
| `admin@portal.com` | `admin123` | Admin     | Admin page, user roles, review profile requests, intern config   |
| `maya@portal.com`  | `maya123`  | Intern    | First-time profile setup, then submit profile changes for review |
| `priya@portal.com` | `priya123` | NorthStar | NorthStar view                                                   |
| `new@portal.com`   | `new123`   | none      | An account an admin hasn't activated yet                         |

These accounts are defined in `app/src/features/login/mockData.ts`.

**Resetting demo data:** changes are saved in `localStorage`. To start fresh, clear the site data
for `localhost:5173` in your browser (DevTools → Application → Storage → Clear site data).

## Scripts

Run from `app/`:

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload                |
| `npm run build`   | Type check and build for production into `app/dist` |
| `npm run preview` | Serve the production build locally                  |
| `npm run lint`    | Run ESLint                                          |

Before opening a pull request, make sure `npm run lint` and `npm run build` both pass.

## Project structure

```
InternPortal/
├── AGENTS.md                   Rules for AI coding agents (read before using one)
├── PROJECT_STATUS_HANDOFF.md   Feature status, roadmap and open questions
└── app/
    ├── vercel.json             Vercel build and SPA route rewrites
    └── src/
        ├── App.tsx             Route table
        ├── pages/              One file per route
        ├── layouts/            Portal shell (header, sidebar) and shared stores
        ├── components/         Shared UI (cards, modal, badges, icons)
        ├── features/<name>/    One folder per feature: components/, hooks, types, mockData
        ├── lib/                Mock Supabase, mock APIs, helpers
        └── styles/             Colors and shared Tailwind class strings
```

Import aliases: `@components/*`, `@icons/*`, `@lib/*`, `@styles/*` (see `app/vite.config.ts`).

## Using AI coding agents

If you use an AI agent (Claude Code, Codex, Cursor, Copilot, …), give it [AGENTS.md](AGENTS.md) first.
In short: agents may not commit, push or merge, and a task isn't done until the tests for every
component it touched pass and the agent has run them.

## Deployment

The app deploys to Vercel from the `app/` folder (`npm run build`, output `dist`).
`vercel.json` sends every route to `index.html` so refreshing a page like `/hours` works.
