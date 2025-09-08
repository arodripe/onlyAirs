# Active Context

Last updated: 2025-09-08

## Current Focus
- Scaffold React app (Vite + TS + Tailwind) with pluggable data layer and analytics stubs.

## Recent Changes
- Pinned toolchain to `vite@5` + plugin-react@4 for Node 18 compatibility.
- Moved Umami injection to module `web/src/umami.ts` and import in `main.tsx`.
- Added JSON fixtures `web/src/fixtures/{fans,totals}.json`; mock client now reads them.
- Enhanced DB with `match_fan_totals` and trigger to increment counters from `vote` inserts.

## Decisions
- Use Memory Bank as the single source of truth for project context.

## Next Steps
- Implement match timer based on `endAt` and show running totals.
- Create read-only match page wired to mock client data.
- Prepare migration path for real backend (Django vs serverless) using the data client.
- Add TODO gates: IP-per-match limit, cookie/local throttle, admin auth, file uploads.

## Risks / Unknowns
- Product requirements and architecture are not yet defined; placeholders exist. 