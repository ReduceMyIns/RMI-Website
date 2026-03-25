# Sales Department

> Handles: New quotes, re-shopping, cross-sells, upsells, new business intake
> Owner: Chase Henderson (Principal Broker)
> Last updated: 2026-03-24

## Tools
- **EZLynx**: Comparative rater for new business quotes
- **NowCerts**: AMS — prospect/insured creation, applications, task tracking
- **HubSpot**: CRM pipeline for new business
- **AI Intake Agent**: Conversational intake → NowCerts prospect creation (in development)

## New Business Question Sets by Policy Type

### Personal Auto
**Drivers (per driver)**: Full name, DOB, DL# + state, marital status, occupation, education level, SR-22 required?
**Vehicles (per vehicle)**: Year, make, model, VIN, primary use, annual mileage, garaging address, custom accessories value?
**Coverage desired**: Liability limits (BI/PD), UM/UIM, Med Pay, comp/collision deductibles, towing/rental reimbursement?
**History**: Violations/accidents last 5 years per driver, continuous coverage + any lapses?

### SR-22 / Non-Owner
- Reason required: DUI, reckless driving, uninsured accident, license suspension
- State requiring filing: TN requires 3 consecutive years, no lapse
- Do they own a vehicle? If YES = SR-22 endorsement on existing auto policy. If NO = Non-Owner policy.

### Motorcycle / ATV / UTV
- Year, make, model, engine size (CCs), VIN
- Value of custom accessories or permanently attached equipment
- Rider safety course completed in last 3 years? (discount trigger)
- Primary use, storage location

### Recreational Vehicle / Travel Trailer
- Type: Class A/B/C motorhome, travel trailer, toy hauler, conversion van
- Year, make, model, VIN
- Ever used as primary residence?
- Value of permanently attached equipment

### Homeowners / HO-3
**Property**: Full address, year built, sq footage, construction type, number of stories
**Roof**: Age, material, last replacement year
**Systems**: Last update to wiring, plumbing, heating
  - Flag ineligible: knob-and-tube wiring, aluminum wiring, Federal Pacific/Zinsco panels, polybutylene plumbing
**Hazards**: Pool/spa/trampoline? Dogs (breed + bite history)? Business operations on premises? Alarm system type?
**Mortgage**: Lender name + address (if financed)
**Coverage desired**: Dwelling (A), Personal Property (C), Personal Liability (E), deductible
**Prior claims**: Last 5 years. Any policy declined/cancelled/non-renewed last 3 years?

### Renters (HO-4)
- Property address (tenant's unit)
- Personal Property limit desired (minimum $15,000 with most carriers)
- Liability limit desired ($100,000 minimum required by most landlords/complexes)
- Deductible: $500 or $1,000
- Pets on premises? Breed + weight if dogs
- Business activity from unit?

### Life Insurance
- DOB, gender, smoker/non-smoker
- Desired coverage amount and term length
- Pre-existing medical conditions, current medications
- Family medical history (heart disease, cancer)
- Occupation, risky hobbies

### Watercraft
- Type: boat, yacht, jet ski
- Year, make, model, length, Hull ID Number
- Engine horsepower, storage location (dry dock, marina)
- Primary waters of navigation (inland lakes, coastal)
- Value of custom accessories

### Special Events
- Event type (wedding, party, corporate event, festival)
- Date(s), time(s), location, estimated attendee count
- Vendors present (caterers, entertainment)?
- Alcohol served?
- Desired coverages: liability, cancellation

### Commercial Lines (Universal Questions)
**Business**: Legal name, DBA, address, entity type (LLC/Corp/etc.), FEIN, years in business
**Operations**: Detailed description of what the business actually does
**Financials**: Annual gross receipts, total employee payroll, subcontracted costs + description of subcontracted work
**Prior insurance**: Current carrier? Any claims last 5 years (date, description, amount)? Any policy cancelled/non-renewed?

## Carrier Appetite Quick Reference

| Risk Type | Primary Carriers | Key Restrictions |
|-----------|-----------------|------------------|
| Personal Auto (TN) | Progressive, Hallmark | Hallmark: no MSRP >$40k, no rideshare, no raised suspensions |
| Homeowners (TN) | Progressive/ASI, Openly, Orion180 | ASI: max $5M Coverage A, no sinkhole history |
| Renters | National General, Hallmark | NG: no mobile homes, no piers/stilts, no solid fuel stoves |
| Commercial BOP <$5M TIV | Coterie, Progressive, Allstate | Progressive: max 4 locations, max $5M TIV |
| Commercial BOP >$5M TIV | Travelers, GUARD, Attune | Travelers: max $15M/location, max $20M annual sales |
| Trucking / Commercial Auto | Progressive, Cover Whale | Cover Whale: dash cam required, 1-25 units, 2yr experience |
| Workers Comp | biBERK, GUARD, Hartford | biBERK: broad appetite; Hartford: professional/office classes |
| Professional Liability | Next, Coterie, USLI EPLI | Next: Claims Made, $0 deductible option available |
| Contractors GL | Xpress Contractors, USLI, Next | Xpress: payroll <$1M, no roofing/demolition/EIFS |
| Vacant Property | USLI Vacant Building | 3/6/9/12 month terms, max $5M, commercial + residential |
| Cannabis | Blitz | Only cannabis specialist — combustible vs. non-combustible extraction matters |
| Real Estate Investors | REInsurePro | Monthly billing, tenant-occupied/vacant/under-renovation |

## Umbrella Trigger Rule
After any quote involving personal auto + homeowners where Personal Liability (Coverage E) is below $500,000 — ALWAYS propose a Personal Umbrella policy.

Script: "Based on our conversation, you might be a good candidate for a personal umbrella policy. It provides an extra $1 million or more of liability protection over your existing policies for a very affordable premium. Would you like to see a quote for that additional protection?"

## KPIs (Target — not yet tracked)
- Quote-to-bind ratio: target >25%
- New policies per month: TBD
- Carrier submission-to-approval rate: TBD
- Average premium per new policy: TBD
