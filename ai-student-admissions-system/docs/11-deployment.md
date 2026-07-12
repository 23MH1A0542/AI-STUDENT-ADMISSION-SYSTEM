# 11. Deployment

## 11.1 Sandbox Strategy
- Build and unit-test all configuration in a Developer/Partial Sandbox.
- Use a second Full/Partial Sandbox as a staging environment mirroring production data volume for
  regression and UAT before promotion.

## 11.2 Validation
- Run `10-testing.md` full regression suite in the staging sandbox.
- Validate Approval Process end-to-end with real (test) manager/counselor users.
- Validate Agentforce guardrails and Data Library scope with UAT users, not just admins.
- Perform a **Validate-Only** deployment (Change Set / metadata deploy without activation) against
  Production first to surface deployment errors before the real deployment.

## 11.3 Change Sets / Metadata Deployment
Deploy in this dependency order to avoid reference errors:
1. Custom Objects: `Course__c`, `Student_Enrollment__c`
2. Custom Fields on standard objects (Contact, Opportunity) and custom objects
3. Validation Rules
4. Email Templates → Email Alerts
5. Approval Process
6. Flows (Record-Triggered, Scheduled, Screen Flow) — inactive on deploy, activate manually post-deploy
7. Page Layouts, Lightning Record Pages, Dynamic Forms
8. Lightning App, Tabs
9. Profiles / Permission Sets (field-level security, object permissions)
10. Reports, Dashboards
11. Agentforce: Prompt Templates → Agent → Data Library → Deployment

## 11.4 Production Deployment
- Schedule deployment during low-usage window (e.g. outside peak counselor hours).
- Freeze configuration changes in sandbox during the deployment window.
- Deploy via Change Set (declarative-only project) or Salesforce CLI/DX package if a source-driven
  pipeline is used.
- Immediately after deploy: activate Flows and the Approval Process (these typically deploy inactive).
- Smoke-test with a single test enrollment record end-to-end in Production.

## 11.5 Rollback Plan
| Component | Rollback Action |
|---|---|
| Flows | Deactivate immediately; prior version can be reactivated if versioned |
| Approval Process | Deactivate; revert entry criteria via a follow-up Change Set |
| Validation Rules | Deactivate rule (checkbox) without deleting, to unblock urgent saves |
| Fields/Objects | Do not delete in haste — deactivate/hide from layouts first, delete only after confirmed safe |
| Agentforce Agent | Disable agent deployment; revert to prior prompt template version |

## 11.6 Monitoring (Post-Deployment)
- Setup Audit Trail reviewed weekly for unexpected configuration changes
- Flow error emails routed to a dedicated Admin queue/distribution list
- Debug logs / Flow interview logs reviewed for failures on scheduled flow runs
- Dashboard refresh monitored for stale data (indicates automation or sharing issue)
- Agentforce usage and guardrail-trigger logs reviewed monthly
