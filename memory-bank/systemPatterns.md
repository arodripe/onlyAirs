# System Patterns and Architecture

## Architecture Overview
- Style: Frontend SPA with pluggable data client
- Backend: TBD (Django API vs serverless); data access abstracted in `web/src/lib/api.ts`

## Components / Services
- Web SPA: Landing/match page, admin-lite placeholder
- Data Client: Mock client now; future HTTP client implementing same interface
 - UI Components: `Header`, `Container`, `Timer`, `ChallengerCard`, `Feed`, `IconsOverlay`, `HeartCount`, `CountryFlag`
 - Interaction: `CardStack` controls the stacked-card UX (tilt, swap, focus)

## Data Model
- Entities: fan, match, vote
- Storage: Postgres (schema in `db/schema.sql`)

## Integration Boundaries
- Analytics: Umami (env-gated script injection)
  - Implemented via `web/src/umami.ts` imported in the SPA entry file.

## MCP Integrations
- Notion MCP: Remote SSE endpoint configured and verified healthy.
- GitHub MCP: Local command server launched via `npx @modelcontextprotocol/server-github`, authenticated with `GITHUB_TOKEN` sourced from `gh auth token` (ephemeral per-shell). Token is never committed; referenced via `${env:GITHUB_TOKEN}`.
- Operational guardrails:
  - `.cursor/rules/core.mdc` includes a "Check MCP connections" procedure.
  - Notion runbook documents remediation: Environment setup runbook (see Knowledge base).

## Error Handling & Reliability
- Client-only MVP; server concerns deferred until backend selection

## Observability
- <logging, tracing, metrics, dashboards>

## Security & Compliance
- No auth in MVP; admin gated later. No PII beyond display name and image URL.

## Performance
- <budgets, caching, pagination, N+1 mitigation>
 - Totals read via pre-aggregated `match_fan_totals` for O(1) lookups.
 - CardStack avoids mid-animation re-renders: two stable card elements (A,B) with transform-only animations; z-index staged via `stage` FSM; `will-change`/`translateZ(0)` for GPU compositing.
 - Feed uses `IntersectionObserver` (threshold 0.5) to lazily trigger typing effect; no scroll handlers.

## Configuration & Feature Flags
- <configuration sources, flag strategy>

## Internationalization & Time
- <timezones, locales, formatting> 