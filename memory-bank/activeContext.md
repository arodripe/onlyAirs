# Active Context

Last updated: 2025-09-12

## Current Focus
- Build MVP UI/UX: live match stack interaction, feed, and micro-interactions.

## Recent Changes
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

## Next Steps
- Vote flow: hook up vote action (client mock now), then backend; add integrity (IP-per-match, cookie/local throttle).
- Backend selection and HTTP client swap for `MockClient`.
- Admin-lite UI (upload fan with `countryCode` + description) or SQL path as agreed.
- Accessibility: prefers-reduced-motion fallbacks for animations.
 - Optional dev DX: add helper script to export token/start local GitHub MCP for diagnostics.

## Risks / Unknowns
- Product requirements and architecture are not yet defined; placeholders exist. 
 - Team onboarding relies on `gh` being installed; documented in runbook.