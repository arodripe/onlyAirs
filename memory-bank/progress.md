# Progress

## Current Status
- MVP API wired. SPA loads match with one call; polls compact totals; claps persist to DB via batch endpoint (single-row per flush with `count`). Live match UI + feed functional; performance improved.

## Recently Completed
- Single-call bootstrap endpoint + compact totals endpoint; replaced likes with claps and added batch endpoint; deprecated old like route.
- Fixed duplicate PK issue by redesigning `clap` table (added `id bigserial`, `count`), updated trigger to add `NEW.count`.
- REST client in SPA; Page Visibility-aware polling; lazy image loading; vote button fix; description reveal restored.
- CardStack refactor to eliminate flicker (stable A/B cards, transform-only animation).
- Typing effect extracted into `useTypewriter` and applied to `ChallengerCard` and feed.
- IconsOverlay unified for flags and status; clap count styling (👏 with brand gradient) replaces heart; single-column feed.
- FavIcon gradient applied; minor fixes (stray char in `index.html`).
 - Dev Ops: MCP wired. Notion MCP stable. GitHub MCP via local `npx` using ephemeral `GITHUB_TOKEN` from `gh`. Added "Check MCP connections" rule and created Notion runbook.

## Upcoming
- Light integrity v1; hosted DB & pooler; feed API; telemetry baseline.

## Known Issues / Blockers
- None currently; awaiting product and technical inputs.

## Changelog
- 2025-09-22: Likes → Claps migration; `POST /api/claps/batch`; client batching; UI icon updated to clap with brand gradient.
- 2025-09-23: Schema/trigger update for claps with aggregated count; Memory Bank expanded; performance and concurrency rationale documented.
- 2025-09-17: API endpoints (bootstrap, totals, vote) + SPA wiring; performance pass; Notion task/RFC updated.
- 2025-09-12: MCP connections established (Notion remote SSE; GitHub local with gh token). Added rule in `.cursor/rules/core.mdc` and created Notion environment setup runbook.
- 2025-09-10: CardStack animation + labels stabilized; `useTypewriter`; feed viewport typing; minor UI updates.
- 2025-09-08: Vite pinned to 5, Umami module injection, fixtures added; DB totals+trigger.