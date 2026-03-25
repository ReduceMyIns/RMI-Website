# Agency OS — Strategy & Current Status

> Living document. Update after every major decision or pivot.
> Last updated: 2026-03-24

## The Vision

One person operating like a team of 5–10. Every client communication handled. Every data entry automated. Every carrier relationship managed. Zero SaaS dependencies that can disappear.

**Exit criteria**: The agency handles all inbound/outbound communications, schedules its own tasks, creates its own NowCerts records, and flags exceptions for human review — without manual intervention for routine work.

## Platform Risk Rules (Non-Negotiable)

Burned three times. Never again.

1. **Airtable**: 50,000 record limit. Discovered after ~1.5 years of dev work. Abandoned.
2. **Google Sheets**: Character limit. Discovered after ~1 year of dev work. Abandoned.
3. **Google AI Studio**: Platform update broke deployment after ~1 month. Codebase survived; hosting did not.

**Rule**: Before adopting any new platform or SaaS tool, identify its hard limits upfront. If limits are undisclosed or unknown, treat as high risk. Never recommend a tool without disclosing known limits.

## Current Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, React Router v7 | Production |
| Backend | Express 4, TypeScript, tsx, Node.js | Production |
| Database | Firebase Firestore | Production |
| Build | Vite 6 | Production |
| AMS | NowCerts (via MCP + proxy) | Production |
| Email | Gmail OAuth2 (server.ts) | Production |
| AI SDK | @google/genai 1.37.0 | **NEEDS SWAP** → @anthropic-ai/sdk |
| Hosting | Google AI Studio | **BROKEN** → migrate to Railway/Render/Hostinger VPS |
| Voice | VAPI + Bland.AI | Infrastructure wired, agents not deployed |
| CRM | HubSpot + NowCerts | Connected, not fully automated |
| Automation | n8n (self-hosted at n8n.srv992249.hstgr.cloud) | Workflows started, not complete |

## Agency OS Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| Strategic Layer | BUILT | This /agency-os/ folder. Created 2026-03-24. |
| Prioritization Engine | NOT BUILT | No AI Chief of Staff yet |
| Knowledge Management | PARTIAL | NowCerts + Firebase as data layer; Agency OS memory layer now created |
| Operations Center | PARTIAL | n8n workflows exist but unfinished |
| VAPI Agent Team | PARTIAL | Architecture designed, agents not deployed |
| Auto Capture | NOT BUILT | **CRITICAL GAP** — agent interactions not writing back to NowCerts/Firebase |
| Communication Layer | PARTIAL | VAPI, JustCall, Aircall, Gmail integrated at infra level |
| Metrics & Monitoring | NOT BUILT | |
| Learning Loops | NOT BUILT | |

## Immediate Next Steps (Priority Order)

1. ✅ **Agency OS Memory Layer** — DONE 2026-03-24. This folder.
2. **Swap Gemini → Claude API** — Replace `@google/genai` with `@anthropic-ai/sdk`. Target files: `services/geminiService.ts` + 7 function imports in `components/FloatingChat.tsx`.
3. **Redeploy** — Off broken Google AI Studio. Best target: Hostinger VPS (already have `srv992249.hstgr.cloud`). Railway as fallback.
4. **Auto Capture** — Every AI interaction (chat, voice, email) writes structured outcome to NowCerts call log + Firebase. This is the flywheel that makes the OS self-improving.
5. **n8n Workflows** — Finish highest-pain daily automation (confirm with Chase each session).

## MCP Servers Active

| Server | Location | Purpose |
|--------|----------|---------|
| NowCerts Hostinger MCP | mcp.srv992249.hstgr.cloud | 87-endpoint NowCerts API wrapper (built by Chase) |
| n8n | n8n.srv992249.hstgr.cloud | Workflow automation |
| HubSpot | — | CRM |
| Gmail | — | Email send/receive |
| Google Calendar | — | Scheduling |
| GitHub | — | Repo access (read-only token — write via local git) |
| Bland.AI | — | Voice AI |

## Key Architecture Decisions

- **Firebase over Airtable/Sheets**: No record limits, real-time sync, scales indefinitely.
- **Self-hosted NowCerts MCP**: Chase built the 87-endpoint wrapper himself. No vendor integration claims — it's verified.
- **GitHub as Agency OS source of truth**: Versioned, survives machine issues, accessible anywhere.
- **Google Drive as Agency OS backup**: n8n syncs agency-os files from GitHub to Drive on a daily schedule.
- **Claude over Gemini**: Anthropic's stability and model quality > Google AI Studio's deployment reliability.
- **Hostinger VPS as primary hosting target**: Already own `srv992249.hstgr.cloud`. Eliminates new hosting dependency.
