# Metrics & Monitoring

> Track agency performance. Review monthly.
> Last updated: 2026-03-24

## Status: NOT YET BUILT

Planned stack:
- **Data source**: NowCerts API + Firebase Firestore
- **Display**: AdminDashboard.tsx (needs expansion beyond current leads/inspections/users tabs)
- **Aggregation**: n8n workflows to pull from NowCerts/Firebase daily and write to a metrics Firestore collection

## Target KPIs

### Business
- New policies written (monthly, YTD)
- Policies cancelled / not renewed (monthly)
- Net policy count change
- Total premium in force
- Commission earned (monthly, YTD)
- Quote volume vs. bind rate (funnel)

### Operational
- Average email response time
- First-contact resolution rate
- COI turnaround time
- Open NowCerts tasks (count overdue)
- NowCerts data completeness score

### AI / Automation
- % of interactions AI-handled without human escalation
- Auto Capture success rate (interactions that successfully write back to NowCerts)
- n8n workflow success/failure rates
- API error rates (NowCerts MCP, Firebase, Gmail, VAPI)

## Dashboard Components Needed (AdminDashboard.tsx)

- [ ] Policy count trend (Recharts line chart — library already in stack)
- [ ] Premium/revenue trend (bar chart)
- [ ] Lead pipeline funnel (quote → submitted → bound)
- [ ] Open tasks list (pull from NowCerts task endpoints)
- [ ] Recent AI interactions log (pull from Firebase interactions collection)
- [ ] Workflow health monitor (n8n status via API)
- [ ] Carrier breakdown (policies count by carrier)
- [ ] Renewals upcoming (30/60/90 day buckets)
