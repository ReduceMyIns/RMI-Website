# Agency OS — Workflows & SOPs

> Standard operating procedures for AI agents to follow.
> Last updated: 2026-03-24

## Call Handling Decision Tree

```
Inbound call received
  → Identify client + policy (if existing)
  → Determine request type:

    Billing question
      Full Service carrier        → TRANSFER to carrier
      Billing & Claim carrier     → TRANSFER to carrier billing dept

    New claim / FNOL
      Full Service carrier        → TRANSFER to carrier
      Billing & Claim carrier     → TRANSFER to carrier claims dept

    Existing claim question       → TRANSFER (both carrier types)

    Policy change (add/remove vehicle, address, coverage)
      Full Service carrier        → TRANSFER
      Billing & Claim carrier     → Handle internally → Sherry

    COI request                   → NEVER transfer → Sherry internally
    Policy cancellation           → NEVER transfer → gather info → Chase or Sherry
    New quote (existing client)   → Chase
    New quote (new prospect)      → Chase
    Re-shopping / price complaint → Chase (retention)
    Complaint about carrier/adjuster/inspector/auditor → Chase (do NOT transfer)
```

## New Business Intake (4 Phases)

### Phase 1: Initial Triage + Contact Info
1. Greet client professionally
2. Collect: Full name, phone, email, mailing address, best time to reach
3. Confirm: Existing client or new?
4. Determine: Personal lines, commercial lines, or both?

### Phase 2: Universal Underwriting Questions (All Applicants)
- Any claims in the last 5 years? (date, type, amount for each)
- Continuous coverage maintained? Any lapses in the last 3 years?

### Phase 3: Line-of-Business Questions
See departments/sales.md for full question sets by policy type.

### Phase 4: Handoff
1. Create prospect/insured record in NowCerts
2. Log call in NowCerts call log with full summary
3. Book callback appointment with Chase
4. Confirm next steps with client

## Policy Change Request (Endorsement)

Required info by change type:

**Address Change**
- New mailing address
- New garaging address (if auto policy and different)
- Effective date of change
- Any business operations at new address?

**Add Vehicle**
- Year, Make, Model, VIN
- Primary use (pleasure, commute, business, artisan)
- Annual mileage
- Desired coverages: liability limits (BI/PD), comp/collision deductibles, UM/UIM, Med Pay
- Financed or leased? If yes: lienholder full legal name + address
- Effective date

**Remove Vehicle**
- VIN or vehicle description
- Effective date
- Confirm: replacement vehicle being added, or coverage being cancelled entirely?

**Add Driver**
- Full legal name, date of birth, DL number + issuing state
- Marital status
- Any violations/accidents/claims in last 5 years?
- Effective date

**Remove Driver**
- Name, reason (no longer in household, exclusion requested)
- Effective date

**Coverage Adjustment**
- Policy number, specific coverage to adjust, current vs. requested limits/deductibles
- **E&O RULE**: For any coverage REDUCTION — document in NowCerts notes that client was informed of the implications before processing.

## Certificate of Insurance (COI) Request

NEVER handle via carrier transfer. Always process internally.

Required info:
- Policy number(s) for all relevant lines (GL, Commercial Auto, Workers Comp, etc.)
- Certificate holder: full legal name + complete mailing address
- Required coverages and minimum limits requested by the holder
- Additional Insured status required? (yes/no)
- Waiver of Subrogation required? (yes/no)
- Primary & Non-contributory wording required? (yes/no)

**E&O RULE**: If certificate holder requirements exceed client's current policy limits — inform client of the discrepancy, offer to quote coverage increase. Do NOT issue a non-compliant certificate without documented client sign-off in NowCerts.

## First Notice of Loss (FNOL)

Collect:
1. Policy number + insured legal name
2. Exact date, time, and location of incident
3. Step-by-step description of what happened
4. Type of claim (auto accident, property damage, employee injury, slip-and-fall, etc.)
5. All known injuries and/or property damage description
6. Names + contact info for other parties involved + any witnesses
7. Police or fire department notified? Report number if available

Closing script to client: "You will be contacted directly by a claims adjuster from [Carrier Name]. All further questions about coverage, the investigation, and settlement should go to them. Our agency remains your advocate — call us if you run into any issues during the process."

NEVER speculate on coverage, fault, or claim outcomes.

## Documentation Request

1. Identify document type (Auto ID Card, Declarations Page, Full Policy, Loss Runs, etc.)
2. Retrieve from NowCerts or carrier portal
3. Deliver to client's email address on file
4. Log in NowCerts: document requested, date/time delivered

## Email Handling

Subject line format: [Action] - [Client Name] - [Policy Number if applicable]

Examples:
- Policy Change Request - John Smith - PA-123456
- New Claim Notification - Jane Doe
- COI Request - ABC Contractors LLC

Always include in email body: client full name, policy number, contact info, and all details needed to process without follow-up questions. Attach all relevant supporting documents.

For Full Service carriers: email carrier directly for routine requests.
For Billing & Claim Service carriers: email carrier billing/claims dept for issues that cannot be resolved by transfer.
