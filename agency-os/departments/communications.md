# Communications Department

> Handles: All inbound/outbound channels — phone, email, SMS, chat, voice AI
> Last updated: 2026-03-24

## Channel Inventory

### Phone
- **Agency number**: 615-900-0288
- **Platform**: JustCall / Aircall (integrated at infra level)
- **AI Voice**: VAPI + Bland.AI — infrastructure wired, agents NOT yet deployed
- **Status**: Manual operation. AI call handling designed but not live.

### Email
- **Address**: service@ReduceMyInsurance.Net
- **Platform**: Gmail with OAuth2
- **Integration**: Full send/receive in server.ts Gmail endpoints
- **Status**: API connected. AI email triage/response NOT automated yet.

### SMS
- **Platform**: JustCall / NowCerts SMS (Twilio under the hood)
- **NowCerts MCP**: SMS insert/get/twilio endpoints available
- **Status**: Connected. NOT automated.

### Website Chat
- **Component**: components/FloatingChat.tsx on client portal
- **AI**: CURRENTLY @google/genai (geminiService.ts) — **PENDING SWAP TO @anthropic-ai/sdk**
- **Status**: Blocked. Fix this before any other chat work.
- **Functions to replace**: getAIResponse, getMarketSearchResponse, getMapsResponse, analyzeMedia, generateSpeech, generatePolicyImage, getLiteResponse

## VAPI Agent Architecture (Planned — Not Yet Deployed)

Four agents to build:

**1. Intake Agent**
- Answers inbound calls
- Collects quote info via conversational Q&A (phases 1-4 from WORKFLOWS.md)
- Creates NowCerts prospect record via MCP
- Books callback appointment with Chase via Google Calendar
- Logs call in NowCerts

**2. Service Agent**
- Handles policy change requests
- Full Service carrier → transfer to carrier
- Billing & Claim Service carrier → gather info → create NowCerts service request → notify Sherry
- COI requests → gather all required info → create task for Sherry in NowCerts

**3. Claims Agent**
- FNOL collection (follows FNOL workflow from WORKFLOWS.md)
- Routes to correct carrier claims line
- Logs FNOL details in NowCerts

**4. Follow-up Agent (Outbound)**
- Pending quotes awaiting info
- Upcoming policy renewals
- Cross-sell opportunities
- Post-claim check-ins

## Auto Capture Requirements (CRITICAL GAP — Not Yet Built)

Every agent interaction (phone, email, chat, SMS) must write back to:

1. **NowCerts call log**: Timestamp, channel, summary of interaction, action taken, next steps
2. **Firebase**: Structured record — insured ID, channel, outcome type, next action, agent that handled
3. **HubSpot**: CRM update if new business opportunity was identified

This is the flywheel. Without Auto Capture, the OS cannot learn or self-manage. Build this immediately after the Gemini → Claude swap and redeploy.

## KPIs (Target — not yet tracked)
- Response time (inbound email): <2 hours during business hours
- Call answer rate: >90%
- AI-handled rate (no human needed): target 60%+ of routine interactions
