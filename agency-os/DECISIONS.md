# Decision Log

> Record every significant architectural, operational, or business decision here.
> Format: Date | Decision | Why | Impact
> Last updated: 2026-03-24

---

## 2026-03-24 — Created Agency OS Memory Layer

**Decision**: Create /agency-os/ folder structure in the RMI-Website GitHub repo as persistent memory for all AI sessions.

**Why**: Without a persistent knowledge layer, every Claude session starts from zero. The system prompt provides base context but cannot capture decisions, active client situations, or session outcomes. This folder creates structured, versioned memory that any session can read and update — building genuine institutional knowledge over time.

**What was created**:
- AGENCY.md: Static facts — 60+ carriers, team, products, call handling rules
- STRATEGY.md: Vision, tech stack, platform risk rules, OS component status, next steps
- WORKFLOWS.md: Call handling, new business intake, COI, FNOL, policy change SOPs
- CLIENTS.md: Active situations and pending follow-ups template
- DECISIONS.md: This file
- SESSION_LOG.md: Session summaries (auto-appended)
- departments/sales.md: Quoting workflows, carrier appetite quick reference
- departments/service.md: Policy service workflows, E&O rules
- departments/communications.md: Channel inventory, VAPI architecture plans
- departments/metrics.md: KPI skeleton (infrastructure not yet built)

**Sync setup**: Google Drive "Agency OS" folder created (ID: 1APO-OiP2I0CEXZg9l-Kj6lvxZnZd1ToY). n8n daily sync workflow mirrors GitHub agency-os files to Drive. Drive = backup/accessibility; GitHub = source of truth.

**Impact**: Every future session reads this folder for full context without re-explaining. Decisions, active work, and outcomes accumulate into a genuine operational memory.

---

## Template for Future Entries

```
## YYYY-MM-DD — [Short Title]

**Decision**: One-line description of what was decided
**Why**: The reason — constraint, failure, insight, or stakeholder ask
**Alternatives considered**: What else was evaluated and why it was rejected
**Impact**: What changes as a result of this decision
```

---
