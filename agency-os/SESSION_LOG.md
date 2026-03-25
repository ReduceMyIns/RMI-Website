# Session Log

> One entry per working session. Append at session end.
> Format: Date | Focus | What was built | What's next
> Last updated: 2026-03-24

---

## 2026-03-24 — Agency OS Bootstrap

**Focus**: Build persistent memory layer for the Agency OS

**What was built**:
- Complete /agency-os/ folder structure (9 files) in workspace — ready to commit to RMI-Website repo
- AGENCY.md: Full carrier list (60+), team, products, call handling rules
- STRATEGY.md: Vision, tech stack, OS component status, next steps, platform risk rules
- WORKFLOWS.md: Call handling decision tree, new business intake, COI, FNOL, policy change SOPs
- CLIENTS.md: Active situations template
- DECISIONS.md: Decision log with first entry
- SESSION_LOG.md: This file
- departments/sales.md: Quoting question sets, carrier appetite quick reference, umbrella trigger rule
- departments/service.md: Service routing table, E&O rules, NowCerts workflow
- departments/communications.md: Channel inventory, VAPI agent architecture, Auto Capture requirements
- departments/metrics.md: KPI skeleton, dashboard components needed
- Google Drive "Agency OS" folder created (ID: 1APO-OiP2I0CEXZg9l-Kj6lvxZnZd1ToY)
- n8n daily sync workflow built: GitHub agency-os → Google Drive

**Note on GitHub push**: GitHub MCP token is read-only on ReduceMyIns/RMI-Website. Files are in workspace folder — use the git commands below to commit.

**Git commit commands**:
```bash
cd /path/to/RMI-Website
cp -r "[workspace]/agency-os" ./
git add agency-os/
git commit -m "feat: bootstrap Agency OS memory layer

Creates /agency-os/ persistent memory structure for all AI sessions.

- AGENCY.md: carriers, team, products, call handling rules
- STRATEGY.md: vision, tech stack, OS status, next steps
- WORKFLOWS.md: call handling, intake, COI, FNOL SOPs
- CLIENTS.md: active situations template
- DECISIONS.md: decision log
- SESSION_LOG.md: session log
- departments/: sales, service, communications, metrics"
git push origin main
```

**Current blockers**:
- @google/genai still in package.json and services/geminiService.ts → needs swap to @anthropic-ai/sdk
- App deployed on broken Google AI Studio → needs redeploy to Hostinger VPS or Railway
- Auto Capture not built → AI interactions not writing back to NowCerts/Firebase yet

**Next session should start with**:
1. Read DECISIONS.md and SESSION_LOG.md (last entry)
2. Check CLIENTS.md for any active situations
3. Priority: Gemini → Claude API swap (services/geminiService.ts + FloatingChat.tsx)

---

## Template for Future Entries

```
## YYYY-MM-DD — [Session Focus]

**Focus**: What was the goal for this session

**What was built**:
- Item 1
- Item 2

**What was changed**:
- File X: what changed and why

**Current blockers**:
- Blocker 1

**Next session should start with**:
1. Action 1
2. Action 2
```
