# Intern Portal: Project Status and Developer Handoff

**Prepared:** November 8, 2026  
**Project:** LalaForever Intern Portal

## 1. Overview

The Intern Portal is a React and TypeScript web application for organizing common intern and team workflows in one place. It provides a dashboard for announcements, tasks, hours, calendar events, direct messages, shared documents, and quick links, plus account profiles and administrator tools. The UI is built as a polished interactive prototype with role-aware views for interns, NorthStar users, and administrators.

The application is a Vite single-page app using React Router. The current repository does **not** connect its feature data to a live backend. `src/lib/supabase.ts` exposes a Supabase-shaped mock auth/admin API backed by browser `localStorage`; feature lists are initialized from mock data in each feature and usually live only in React state. `supabase.types.ts` supplies local TypeScript interfaces, not generated types from a connected Supabase project. Treat the current login, authorization, persistence, and notification behavior as demonstration behavior rather than production security or durable shared data.

The production build is configured for Vercel in `app/vercel.json`, with SPA route rewrites. The front end lives under `app/`; start locally with `cd app` then `npm install` and `npm run dev`. Useful project commands are `npm run build` and `npm run lint`. Core dependencies are React 19, React Router 7, TypeScript 6, and Vite 8.

## 2. In-depth features

| Feature | What it does | Current implementation/status |
| --- | --- | --- |
| Sign-in and roles | Sign-in screen, protected routes, role-aware admin access, account menu. Roles are `intern`, `northstar`, and `admin`. | Demo accounts are in `features/login/mockData.ts`. `AuthProvider` reads the mock session. Session and admin user data are stored locally; this is not Supabase Auth. |
| Dashboard | Greeting, date, overview cards/widgets, expandable feature panels. | Main composition is in `pages/Dashboard.tsx`; widgets are local React state and mock data. |
| Announcements and notifications | Expand/collapse announcements, post/delete announcements; show and dismiss profile-request outcomes as pinned notices. | Team announcements are in-memory mock state. Approval/rejection notices are stored in localStorage by the request API; no email or push delivery. |
| To-do list | Create tasks, set priority, assign to self or a teammate/custom assignee, filter mine/delegated/done/all, mark complete, remove completed tasks. | State starts from `INITIAL_TODOS`; in-memory only. No cross-user task sharing or backend persistence. |
| Hours log | Add entries with date, project, description, and hours; browse the hours view and summary. | Entries start from `INITIAL_HOURS` and are held in component state; no durable storage, approvals, or reporting backend. |
| Calendar | Browse month grids, select dates, create events with date/time, color, share-with and repeat-form controls, remove events. | Events start from mock data and are held in React state. The form captures advanced recurrence/share options, but event creation currently folds time/repeat into a display title; it does not implement a true recurrence engine or sharing service. |
| Direct messages | Conversation list, message composition, replies/threads, reactions, unread counts, pinning, optimistic send/delivered state. | Seed conversations and messages from `features/dms/mockData.ts`; hook state is in-memory. The delayed delivered status is simulated; no realtime transport or durable messages. |
| Quick documents | View resource links and post a document title, URL, and type. | Seeded document list and in-memory additions; link destinations and data are not centrally managed. |
| Quick links | Shortcuts for tools such as Google Chats, GitHub, Claude, Figma, Canva, IT support, learning, and resources. | Data in `features/quickLinks/mockData.ts`; current URLs are `#` placeholders and need real destinations. |
| Profile | Complete/edit name, preferred name, title, and phone. Non-admin edits to an existing profile enter an approval workflow. | Initial completion/admin update writes to mock local storage. Existing non-admin profile changes create a mock request. |
| Admin and request review | Admin can list/create users, set roles, review profile-change requests, approve/reject with an optional note, and see request history. Users can see their own history. | Mock admin methods enforce role checks in client code; request records and notifications are localStorage data. Client-side checks are not a security boundary. |

### Main code map

- `app/src/App.tsx` — route table and auth provider.
- `app/src/pages/Dashboard.tsx`, `Login.tsx` — dashboard and login entry points.
- `app/src/features/<feature>/` — feature types, hooks, mock data, and UI components.
- `app/src/lib/supabase.ts` — mock auth/user store; despite its name, it does not import the Supabase SDK.
- `app/src/lib/requestsApi.ts` — local profile-change requests and in-app notifications.
- `app/src/features/login/mockData.ts` — seeded demo users and roles.
- `app/src/styles/colors.ts`, `app/src/index.css`, `app/src/App.css` — visual system and responsive styling.

## 3. Accomplishments

- **End-to-end portal experience:** Implemented the main authenticated dashboard and distinct profile, history, and admin routes, giving the project a coherent experience beyond isolated UI mockups.
- **Role-aware access and workflows:** Established intern, NorthStar, and admin role concepts; protected the admin route; built account creation/role assignment and role-specific request-history views.
- **Profile review workflow:** Implemented profile completion/editing, pending profile-change requests, admin approve/reject decisions and notes, request history, and in-app outcome notices.
- **Rich dashboard interactions:** Built expandable widgets and functional front-end interactions for announcements, tasks, hours, calendar, documents, and messaging, with forms, filtering, validation, and state updates.
- **Messaging prototype:** Added conversation sorting/selection, unread tracking, message composition, replies, reactions, pinning, and simulated delivery state.
- **Reusable UI foundation:** Created shared cards, modal, avatar, icon, badge, and color components/styles to keep feature screens visually consistent.
- **Developer-ready structure:** Organized the app by feature with local TypeScript types and hooks, configured route fallback for Vercel, and included build/lint scripts.

These accomplishments describe implemented prototype functionality. Persistence and access decisions must be reimplemented and verified against a trusted backend before real users or sensitive data are introduced.

## 4. Future works

### Connect Supabase and real data

Replace the mock layer with a real Supabase project and a clearly defined schema for users/profiles, roles, announcements, tasks, hours entries, calendar events, documents/links, conversations/messages/reactions, profile-change requests, and notifications. Decide which records are global, team-scoped, or user-owned before migrating the widgets. Replace seeded mock data with loading/error/empty states backed by queries and mutations; choose where realtime subscriptions are useful (for example messages, announcements, and request decisions).

Use Supabase Auth for sessions and account lifecycle. Never expose admin service-role credentials in the browser. Enforce role and row access with Row Level Security policies and server-side/Edge Function logic; client route guards should remain a user-experience aid only. Define migrations, seed data for development, indexes, retention/backup expectations, and a safe process for deploying schema changes. Move demo credentials out of the release build and plan how existing local demo data should be discarded or migrated.

### Add email notifications

Add an email API/provider for events that should reach users outside the portal, especially profile-request submission and admin approval/rejection. Trigger sends from a trusted server-side function (such as a Supabase Edge Function or equivalent), never directly from browser code with a secret API key. Agree on sender/domain setup, templates, recipients, opt-out/notification preferences, retry and failure handling, and how duplicate sends are prevented. Keep in-app notifications as a separate channel and define whether email delivery is immediate or batched.

### Product and engineering follow-through

- Replace `#` quick-link URLs; confirm which external services and document repositories should be linked or integrated.
- Clarify business rules that the prototype UI currently only suggests: calendar recurrence and sharing, hours approval/reporting, task visibility/delegation, message retention and membership, announcement permissions, and profile request handling.
- Add validation and accessibility review across forms, keyboard flows, responsive layouts, and loading/error feedback.
- Establish automated checks for important role and request workflows, plus build/lint checks in CI. Add monitoring, error reporting, and deployment environment configuration.
- Document ownership, support contacts, release process, and the production data/privacy expectations for interns.

## 5. Technical questions for onboarding / the final month

### Product and workflow questions

1. Who are the intended users and what exact permissions should intern, NorthStar, and admin have? Can NorthStar review requests or manage any data?
2. Which dashboard features are in the first production release, and which are only concepts? Which tools/URLs should the quick links open?
3. What are the rules for hours submission, approval, edits, weekly totals, and exports? Who can see whose hours?
4. Should calendar events be private by default, shareable with selected people, and truly recurring? Which timezone should be stored/displayed?
5. Who can post/delete announcements and documents? Should tasks be visible to assignees, authors, or the whole team?
6. For profile changes, what fields require approval, who reviews them, and what should happen when a request is rejected or left pending?

### Technical questions

1. Is a Supabase project already provisioned? Who owns it, and are there existing tables, migrations, environments, or policies to follow?
2. What schema and RLS policy approach should we use for each feature? How should roles be represented and protected from user self-escalation?
3. Which email provider/API is approved, who manages credentials and sender-domain verification, and what email templates are required?
4. Which events require email, in-app notifications, or both? What retry, audit, deduplication, and delivery monitoring are expected?
5. What are the deployment environments and release process (Vercel preview/production, environment variables, database migration ownership, rollback)?
6. Are there privacy, retention, accessibility, security, or compliance requirements for profile data, hours, and messages?
7. What testing approach is expected, and where should integration/end-to-end tests run? Are there existing CI checks or conventions?
8. Who should review the architecture and give a walkthrough of Supabase Auth/RLS, deployment, and operational support before handoff?

### Suggested walkthroughs to request

- Supabase project structure, Auth setup, RLS policies, migrations, and local development workflow.
- Email provider integration, secret management, templates, and how to troubleshoot failed notifications.
- Vercel environments, releases, domain configuration, and rollback procedure.
- Product decisions for roles, hours/calendar rules, and profile approval, with the person who owns each workflow.
- Current known bugs, accessibility issues, and the roadmap priorities for the first month after handoff.
