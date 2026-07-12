# 12. Documentation

## Project Introduction
The AI-Enabled Student Admissions & Support Management System is a fully declarative Salesforce
application built to centralize and automate the student admissions lifecycle for training institutes and
educational organizations, augmented with Agentforce AI for summarization, risk analysis, and discount
recommendations.

## Architecture
See `02-system-architecture.md` for the high-level architecture, ERD, data flow, object relationship, and
process flow diagrams. In summary: users interact through a single Lightning App; all logic sits in
declarative automation over a compact data model of standard and custom objects; a security layer governs
visibility; Agentforce reads/writes selected fields on the core transactional object.

## Objects
See `03-data-model.md`. Core objects: Account, Contact (Student), Opportunity (Application), User,
Course__c, Student_Enrollment__c — connected via master-detail relationships that enforce data integrity
between Student, Course, and Enrollment.

## Flows
See `06-automation.md`. Two record-triggered flows (priority notification, discount-approval submission),
one scheduled flow (pending-approval follow-up), and one screen flow (guided enrollment creation).

## Agentforce
See `07-agentforce-ai.md`. Four prompt templates (summary, risk, discount recommendation, priority
prediction) power the "Admissions Assistant Agent," scoped to a read-only Data Library with guardrails
preventing direct approval actions.

## Security
See `05-security-model.md`. Two custom profiles (Counselor, Manager) built on a two-level role hierarchy,
with field-level security restricting write access to AI-generated fields and sharing rules elevating
visibility for high-priority records.

## Automation
See `06-automation.md` for the full validation rule, email template/alert, approval process, and flow
inventory, including entry criteria and field updates.

## Deployment
See `11-deployment.md` for the sandbox-to-production strategy, deployment order, and rollback plan.

## Future Enhancements
See `17-bonus-features.md` — Experience Cloud portal for self-service applicants, WhatsApp/SMS
notifications, payment gateway integration, and Predictive Analytics/Einstein enhancements.

## Conclusion
This project demonstrates an enterprise-style admissions system built entirely on Salesforce's
declarative platform, showing that complex, AI-augmented business processes can be delivered without
custom code — while remaining secure, auditable, and maintainable by an Admin team.
