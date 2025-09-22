# Active Context

Last updated: 2025-09-17

## Current Focus
- Build MVP UI/UX: live match stack interaction, feed, and micro-interactions.

## Recent Changes
- API (Vercel Functions): added `GET /api/match/bootstrap` (single-call load), `GET /api/match/current/totals` (compact polling), `POST /api/fans/:id/like` (batched insert), DB-backed rate limiter, serverless-friendly PG pool.
- Web: switched to real REST client; initial load via single call; polling totals only; Page Visibility pause; lazy-loaded feed images; fixed vote button event propagation; restored description reveal on expand.
- UI: Introduced stacked-card interaction (`CardStack`) with hand-like three-stage animation (pre-shift, cross, settle). Stable cards A/B; only wrapper transforms animate (no mid-animation prop swaps) to avoid flicker.
- Labels: `Challenger 1` bound to card A (left), `Challenger 2` to card B (right), independent of front/back.
- Cards: `ChallengerCard` shows country flag overlay, brand styling, heart count, and optional description.
- Typing effect: Created reusable `useTypewriter` hook; used for description reveal on tap (front card) and in feed when the card enters viewport (IntersectionObserver, threshold 0.5).
- Feed: Single-column stack; each item reveals description with the typing effect; winner/loser overlays with scrims; flags overlay via shared IconsOverlay.
- Theming: Brand color `rgb(152, 84, 26)`; gradient text utility `.brand-gradient-text`.
- Assets: FavIcon SVG updated to use in-SVG gradient fill; stray character fixed in `index.html`.
- Tooling: Pinned Vite 5 for Node 18; Tailwind v3 with PostCSS; Umami env-gated in `src/umami.ts`.
 - Dev Tooling: MCP configured. Notion MCP via remote SSE is stable. GitHub MCP runs locally via `npx @modelcontextprotocol/server-github` using an ephemeral `GITHUB_TOKEN` from `gh auth token`. Runbook created in Notion and rules updated to "Check MCP connections" on load.

## Decisions
- Use Memory Bank as the single source of truth for project context.
 - Use ephemeral GitHub token via GitHub CLI for MCP (no tokens committed; env-only).
 - Add rule to check MCP connections before work; follow Notion runbook if any fail.
- Collapsed initial match load to a single endpoint to reduce cold-start impact and network round trips.

## Next Steps
- Client batching for votes and integrity v1 (per-IP+UA, cookie nonce).
- Hosted Postgres with pooler (RDS Proxy/pgBouncer); align Vercel region.
- Feed API endpoint and admin-lite upload; image pipeline to object storage + CDN.
- Observability baseline (structured logs, 5xx alert). 

## Risks / Unknowns
- Product requirements and architecture are not yet defined; placeholders exist. 
 - Team onboarding relies on `gh` being installed; documented in runbook.