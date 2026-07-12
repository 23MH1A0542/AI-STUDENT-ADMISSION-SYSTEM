# AI-Enabled Student Admissions & Support Management System

A production-ready, 100% declarative Salesforce application (no Apex) that manages the full student
admissions lifecycle — leads, applications, enrollments, discounts, approvals, and communication — enhanced
with **Agentforce AI** for prioritization, risk analysis, and discount recommendations.

> Built with: Flows · Approval Processes · Validation Rules · Dynamic Forms · Lightning App Builder ·
> Reports & Dashboards · Agentforce (Prompt Builder + Agent Builder) · Sharing & Security Model

---

## 📁 Repository Structure

```
ai-student-admissions-system/
├── README.md                          → you are here
├── docs/
│   ├── 01-project-overview.md
│   ├── 02-system-architecture.md      → Mermaid: architecture, ERD, data flow, process flow
│   ├── 03-data-model.md               → Objects, fields, types, relationships, validation rules
│   ├── 04-configuration.md            → Objects, fields, tabs, layouts, LRP, Dynamic Forms
│   ├── 05-security-model.md           → Profiles, Roles, Permission Sets, OWD, Sharing
│   ├── 06-automation.md               → Flows, Approval Process, Email Alerts/Templates
│   ├── 07-agentforce-ai.md            → Prompt Templates, Agent, Topics, Actions, Guardrails
│   ├── 08-reports-dashboards.md       → 5 dashboards, KPIs, filters
│   ├── 09-ui-design.md                → Lightning App, page layouts, Agentforce panel
│   ├── 10-testing.md                  → Positive / negative / boundary test cases
│   ├── 11-deployment.md               → Sandbox → Production, change sets, rollback
│   ├── 12-documentation.md            → Consolidated project documentation
│   ├── 13-interview-questions.md      → 100 Salesforce Q&A tied to this project
│   ├── 14-resume-content.md           → ATS resume bullets
│   ├── 15-presentation-outline.md     → 15-slide deck with speaker notes
│   ├── 16-portfolio-description.md    → Portfolio blurb, LinkedIn post, elevator pitch
│   └── 17-bonus-features.md           → Enterprise extension roadmap
├── screenshots/                       → placeholders for your org screenshots
│   └── PLACEHOLDER.md
├── LICENSE
└── CONTRIBUTING.md
```

## 🚀 Quick Start (build this in your own org)

1. Read `docs/03-data-model.md` and create the custom objects/fields exactly as listed.
2. Follow `docs/04-configuration.md` for tabs, page layouts, and Dynamic Forms.
3. Apply `docs/05-security-model.md` (Profiles → Roles → Sharing) *before* creating users.
4. Build automation from `docs/06-automation.md` in this order: Validation Rules → Email Templates →
   Email Alerts → Approval Process → Flows.
5. Enable Agentforce and build the agent using `docs/07-agentforce-ai.md`.
6. Build dashboards from `docs/08-reports-dashboards.md`.
7. Assemble the Lightning App per `docs/09-ui-design.md`.
8. Run through `docs/10-testing.md` before deployment.
9. Deploy using `docs/11-deployment.md`.

## 🧱 Tech Stack

| Layer | Salesforce Feature |
|---|---|
| Data Model | Standard Objects (Account, Contact, Opportunity, User) + Custom Objects (`Course__c`, `Student_Enrollment__c`) |
| Automation | Record-Triggered Flows, Scheduled Flow, Screen Flow, Approval Process, Validation Rules |
| Security | Profiles, Roles, Role Hierarchy, Permission Sets, OWD, Sharing Rules |
| AI | Agentforce, Prompt Builder, Data Library |
| UI | Lightning App Builder, Dynamic Forms, Compact Layouts |
| Reporting | Reports & Dashboards |

## 📄 License
MIT — see `LICENSE`.

## 🤝 Contributing
See `CONTRIBUTING.md` for how to propose changes to this declarative build (all changes are config-based,
tracked via change sets or a scratch-org DX package where applicable).
