# Service Department

> Handles: Policy changes, billing, COIs, claims intake, underwriting follow-ups, documentation
> Owner: Sherry Norton (Customer Service Manager)
> Last updated: 2026-03-24

## Tools
- **NowCerts**: AMS — policy lookup, endorsements, service requests, notes, tasks
- **JustCall / Aircall**: Phone system
- **Gmail**: Email (OAuth2 integration in server.ts)
- **Carrier portals**: Direct endorsement processing for complex changes

## Service Request Routing

| Request Type | Transfer? | Route |
|-------------|-----------|-------|
| Billing question | Yes (all carriers) | Carrier |
| New claim / FNOL | Yes (all carriers) | Carrier |
| Existing claim question | Yes (all carriers) | Carrier |
| Policy change (Full Service carrier) | Yes | Carrier |
| Policy change (Billing & Claim Service carrier) | No | Sherry internally |
| COI request | Never | Sherry internally |
| Policy cancellation | Never | Chase or Sherry (assess retention first) |
| Coverage reduction request | No | Sherry — document E&O disclaimer |
| Documentation request | No | Pull from NowCerts, email to client |

## E&O Critical Rules

1. **Coverage reduction**: Always document in NowCerts notes that client was informed of the implications BEFORE processing the change. No exceptions.
2. **Non-compliant COI**: Never issue a certificate when the holder's requirements exceed the client's current policy limits — without documented client sign-off.
3. **FNOL**: Never speculate on coverage, fault, or claim outcome. Direct all coverage questions to the carrier adjuster.
4. **Documentation rule**: If it is not in NowCerts, it did not happen.

## NowCerts Service Workflow

1. Search insured — verify identity (name, address, policy number)
2. Pull up all active policies and open service requests
3. Document the incoming request as a timestamped note in NowCerts
4. Process the change OR create a service request for carrier processing
5. Confirm back to client: what was done, what happens next, realistic timeline

## Proactive Communication Standards

- Endorsements submitted to carrier: if no carrier confirmation within 3 business days → follow up with carrier AND send client status update
- COI requests: target turnaround under 2 hours during business hours
- Documentation requests: deliver same business day, log delivery timestamp in NowCerts

## KPIs (Target — not yet tracked)
- First-contact resolution rate: target >80%
- COI turnaround time: target <2 hours
- Policy change processing time: target <24 hours
