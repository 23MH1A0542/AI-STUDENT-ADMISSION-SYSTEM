# 17. Bonus Features / Enterprise Roadmap

| Feature | Value Add | Notes |
|---|---|---|
| Einstein AI (Predictive Scoring) | Native predictive models for enrollment likelihood, churn risk | Complements Agentforce with structured ML scoring |
| Predictive Analytics (Tableau CRM / Data Cloud) | Deeper trend analysis across cohorts, terms, and courses | Useful once data volume grows beyond dashboard-level analysis |
| WhatsApp Integration | Real-time applicant communication via WhatsApp Business API | High engagement channel for reminders and status updates |
| SMS Notifications | Low-friction alerts for payment/approval status | Pairs well with the existing Email Alert framework |
| Experience Cloud Portal | Self-service portal for applicants to check status, upload docs | Reduces counselor workload for routine status inquiries |
| Document Generation | Auto-generate offer letters, fee receipts as PDF | Could use Salesforce's native document generation or a partner app |
| Payment Gateway Integration | Online fee payment directly from the portal | Ties Payment Status field to real transaction data |
| LWC Enhancements | Custom Lightning Web Components for richer dashboards/wizards | Use once declarative UI hits its limits |
| REST API Integration | Sync with an external Student Information System (SIS) | External ID fields would support upsert-based sync |
| Power BI Integration | Cross-platform reporting for institutions already on Power BI | Via Salesforce Connector for Power BI |
| Tableau Integration | Advanced, interactive visual analytics | Native Salesforce-Tableau integration |
| Mobile App Support | Salesforce Mobile App configuration for counselors on the go | Already inherited from Lightning App; add mobile-specific Compact Layouts |

**Prioritization note:** Recommended next phase = Experience Cloud Portal + Payment Gateway (highest
applicant-facing value), followed by WhatsApp/SMS notifications, then Einstein/Predictive Analytics once
enough historical data exists to train meaningful models.
