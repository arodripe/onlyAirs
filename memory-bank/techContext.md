# Tech Context

## Stack
- Languages: TypeScript (frontend), SQL (DB); backend TBD (Python/Django or serverless)
- Frameworks: React + Vite
- Styling: TailwindCSS v3 (PostCSS pipeline)
- Tooling: npm, ESLint, Prettier (via ESLint rules), Vite 5

## Repository Layout
- Root: `onlyAirs/`
- Apps/Packages: <structure>

## Local Development
- Prereqs: Node 18+ (Node 20 recommended)
- Setup: `cd web && npm install`
- Env vars: `VITE_UMAMI_URL`, `VITE_UMAMI_WEBSITE_ID` (optional)
- Run: `npm run dev`

## MCP Setup (local dev)
- GitHub MCP (ephemeral auth):
  - Export a token for the current shell: `export GITHUB_TOKEN="$(gh auth token)"`
  - Validate: `gh auth status -t`
  - Cursor reads `${env:GITHUB_TOKEN}` for the local MCP server.
- Notion MCP: Remote SSE, no local steps required.

## Environments
- Local, Staging, Production: <urls, differences>

## CI/CD
- <provider, pipelines, gates>

## Dependencies
- Runtime: react, react-dom
- Dev: vite@5, @vitejs/plugin-react@4, typescript, tailwindcss@3, postcss, autoprefixer, eslint
 - Tools: `@modelcontextprotocol/server-github` (invoked via `npx`, not installed locally)

## Testing Strategy
- Start with component-level tests later (Vitest + React Testing Library).

## Frontend Patterns
- `useTypewriter` hook for progressive text reveal; re-used by `ChallengerCard` and `FeedItemCard`.
- `IntersectionObserver` for viewport-triggered effects; threshold=0.5; disconnect or idempotent trigger.
- `IconsOverlay` for consistent scrim/position overlays; avoids duplication.

## Code Quality
- Lint: <rules>
- Format: <tool>

## Configuration & Secrets
- Frontend uses Vite env vars prefixed with `VITE_`. Backend secrets TBD.