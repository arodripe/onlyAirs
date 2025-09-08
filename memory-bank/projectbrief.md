# Project Brief — OnlyAirs

## Overview
- Project name: OnlyAirs
- One-liner: Head-to-head community voting for fan photos.
- Vision: Lightweight, global fan-voting matches with simple admin and analytics.

## Goals
- MVP landing with live match between two fans
- Visible running vote totals; 6h match timer based on `endAt`
- Admin-light: seed via SQL; later, simple upload/admin UI

## Non-goals
- Full auth system, payments, complex moderation
- Bot-proof voting (tracked as future TODO)

## Scope
- MVP scope: React SPA, mock client data, Postgres schema, seed of 20 fans
- Future scope: Real backend (Django or serverless), uploads, rate limiting

## Success Metrics
- Engagement: visitors interact and vote; time-on-page during live match
- Ops: simple deploy; <1s TTI on modern devices

## Constraints
- Technical: Prefer React SPA; backend pluggable; Postgres DB
- Product: Move fast; lean MVP; English-only

## Stakeholders
- Product: Andres
- Engineering: Andres + AI pair

## Glossary
- Fan: person/photo that can be voted on
- Match: time-boxed head-to-head vote

## Open Questions
- Backend path: Django API vs serverless HTTP functions
- Image storage: Vercel/S3/Supabase; add optimizer on upload