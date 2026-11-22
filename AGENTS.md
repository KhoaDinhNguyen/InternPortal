# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, etc.) working in this repository.
Developers: give this file to your agent before starting a task. Agents: read it all before you change anything.

---

## 1. Hard rules (non-negotiable)

### 1.1 No commits, pushes, or merges
AI agents **must not** change git history or the remote. You may **not** run:

- `git commit`, `git commit --amend`
- `git push` (any form, including `--force`)
- `git merge`, `git rebase`, `git cherry-pick`, `git pull`
- `git reset --hard`, `git checkout -- <file>`, `git restore`, `git stash`, `git clean` (these throw away work)
- `git tag`, `git branch -d/-D`
- `gh pr create`, `gh pr merge`, or merging through any web UI or API

Read-only git commands are fine: `git status`, `git diff`, `git log`, `git show`, `git blame`.

Leave all your changes **unstaged in the working tree**. The developer reviews, commits, and pushes.
If a task seems to require a commit, push, or merge, stop and ask the developer to do it.

### 1.2 A task is not done until the tests pass and you ran them
Before you report a task as done:

1. Every component, hook, or util you **created or changed** has a test.
   If there isn't one yet, write it (see section 4).
2. You **ran** those tests yourself in this session and they **pass**.
3. `npm run lint` and `npm run build` pass (the build also runs the type check).
4. Your final message includes the exact commands you ran and a summary of the results.

Do not say "tests should pass" or "I didn't run them but...". If you could not run the tests
(missing tooling, environment error, failing tests you couldn't fix), say the task is
**not done** and explain why. Never delete, skip (`.skip`, `.only`), or weaken a test to make it pass.

---

## 2. Project context

- React 19 + TypeScript 6 + Vite 8 single-page app, React Router 7, Tailwind CSS 4, React Compiler on.
- All app code lives in `app/`. Run every npm command from `app/`.
- There is **no real backend yet**. `src/lib/supabase.ts` is a mock that copies the Supabase API shape
  and stores data in `localStorage`. Feature data comes from each feature's `mockData.ts`.
  Do not add the real Supabase SDK or any secret key unless the task asks for it.
- Client-side role checks (`ProtectedRoute allow={[...]}`) are only a UI aid, not security.
- Roles: `intern`, `northstar`, `admin`. Demo users are in `src/features/login/mockData.ts`.
- Deployed to Vercel (`app/vercel.json` rewrites all routes to `index.html`).
- Background and roadmap: `PROJECT_STATUS_HANDOFF.md`.

## 3. Commands (run from `app/`)

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm test` | Run the test suite once (Vitest) |
| `npx vitest run <path>` | Run only the tests for the files you touched |
| `npm run lint` | ESLint |
| `npm run build` | Type check (`tsc -b`) and production build |

If `npm test` does not exist yet (no test runner installed), **stop and tell the developer**.
Do not install a test framework on your own unless the task asks for it.

## 4. Testing conventions

- Runner: **Vitest** with **React Testing Library** and `jsdom`.
- Put the test next to the file it tests: `TicketRow.tsx` → `TicketRow.test.tsx`, `utils.ts` → `utils.test.ts`.
- Test behaviour the user sees (rendered text, roles, clicks, form submit), not implementation details.
  Prefer `getByRole` / `getByLabelText` over test ids.
- Mock APIs (`src/lib/*Api.ts`) use `localStorage`. Call `localStorage.clear()` in `beforeEach`
  so tests don't leak state into each other.
- Components that use `useAuth`, `usePortal`, or React Router need their providers in the test
  (`MemoryRouter`, `AuthProvider`, or a small test wrapper). Reuse a shared wrapper if one exists
  in `src/test/` instead of writing a new one.
- Fake timers (`vi.useFakeTimers()`) for anything that uses `delay()` or `setTimeout`.

## 5. Code structure and conventions

```
app/src/
  App.tsx              Route table
  main.tsx             Entry point
  pages/               One file per route. Thin: compose feature components, no business logic.
  layouts/             Portal shell (header, sidebar) and the shared stores (usePortalStores)
  components/          Shared UI used by 2+ features (Card, Modal, badges/, icons/)
  features/<name>/     Everything for one feature:
    components/        Feature UI
    hooks.ts           State and actions (or hooks/ folder when there are several)
    types.ts           Feature types
    mockData.ts        Seed data until the backend exists
    utils.ts           Pure helpers
  lib/                 Shared infrastructure: mock supabase, mockStore, mock APIs, cn()
  styles/              colors.ts and shared Tailwind class strings (ui.ts)
```

Rules:

- **New feature** → new folder in `features/` following the layout above. Don't add feature code to `components/`.
- **New route** → page file in `pages/`, registered in `App.tsx`. Admin-only routes go inside
  `<ProtectedRoute allow={["admin"]}>`.
- **State shared across pages** (sidebar counts, data that must survive page changes) goes through
  `layouts/usePortalStores.ts` and is read with `usePortal()`.
- **Imports**: use the path aliases `@components/*`, `@icons/*`, `@lib/*`, `@styles/*` instead of
  long `../../` paths. Relative imports are fine inside the same feature folder.
- **Styling**: Tailwind classes. Reuse class strings from `@styles/ui` and colors from `@styles/colors`.
  Merge classes with `cn()` from `@lib/cn`.
- **Types**: no `any`. Keep types in the feature's `types.ts`.
- **Mock APIs** return `{ data, error }` like Supabase does. Keep that shape so swapping in real
  Supabase later only changes `lib/`.
- Keep changes focused on the task. Don't rename, move, or reformat unrelated files.

## 6. When you finish, report

1. What you changed (files and a one-line reason each).
2. The test, lint, and build commands you ran and their results.
3. Anything you could not do, any assumptions, and anything the developer should check by hand.
4. A reminder that the changes are uncommitted and ready for the developer to review.
