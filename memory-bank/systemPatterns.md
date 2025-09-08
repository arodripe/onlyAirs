# System Patterns and Architecture

## Architecture Overview
- Style: Frontend SPA with pluggable data client
- Backend: TBD (Django API vs serverless); data access abstracted in `web/src/lib/api.ts`

## Components / Services
- Web SPA: Landing/match page, admin-lite placeholder
- Data Client: Mock client now; future HTTP client implementing same interface

## Data Model
- Entities: fan, match, vote
- Storage: Postgres (schema in `db/schema.sql`)

## Integration Boundaries
- Analytics: Umami (env-gated script injection)
  - Implemented via `web/src/umami.ts` imported in the SPA entry file.

## Error Handling & Reliability
- Client-only MVP; server concerns deferred until backend selection

## Observability
- <logging, tracing, metrics, dashboards>

## Security & Compliance
- No auth in MVP; admin gated later. No PII beyond display name and image URL.

## Performance
- <budgets, caching, pagination, N+1 mitigation>
 - Totals read via pre-aggregated `match_fan_totals` for O(1) lookups.

## Configuration & Feature Flags
- <configuration sources, flag strategy>

## Internationalization & Time
- <timezones, locales, formatting> 