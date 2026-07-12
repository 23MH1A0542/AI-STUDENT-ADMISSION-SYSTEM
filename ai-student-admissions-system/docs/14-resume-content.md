# 14. Resume Content

## ATS-Friendly Project Description
**AI-Enabled Student Admissions & Support Management System** | Salesforce (Declarative) + Agentforce
Designed and implemented an end-to-end Salesforce application automating the student admissions lifecycle
for training institutes, using 100% declarative configuration (no Apex) — including a custom data model,
role-based security, multi-stage approval automation, and an Agentforce AI agent for application
summarization, risk analysis, and discount recommendations.

## Key Features
- Built a custom data model (`Course__c`, `Student_Enrollment__c`) with master-detail relationships,
  formula fields, and validation rules enforcing business policy
- Automated a manager-approval workflow for high-discount enrollments using Approval Processes and
  Record-Triggered Flows
- Designed a Screen Flow wizard reducing enrollment data-entry errors and time
- Implemented a two-tier role hierarchy, custom profiles, field-level security, and sharing rules to
  enforce least-privilege access
- Configured Duplicate/Matching Rules preventing duplicate student and enrollment records
- Built an Agentforce agent with 4 prompt templates (summary, risk analysis, discount recommendation,
  priority prediction), grounded in a read-only Data Library with enforced guardrails
- Delivered 5 role-specific dashboards (Admissions, Approvals, Revenue, Course, Counselor Performance)

## Technologies Used
Salesforce Platform · Flow Builder (Record-Triggered, Scheduled, Screen Flows) · Approval Processes ·
Validation Rules · Dynamic Forms · Lightning App Builder · Agentforce · Prompt Builder · Agent Builder ·
Reports & Dashboards · Profiles/Roles/Permission Sets · Duplicate & Matching Rules

## Responsibilities
- Gathered and translated business requirements into a scalable Salesforce data model and security design
- Built and unit-tested all automation (Flows, Approval Process, Validation Rules) in a sandbox environment
- Configured Agentforce prompt templates and an agent with enforced guardrails around AI-assisted decisions
- Designed dashboards and reports supporting counselor and management decision-making
- Authored complete technical documentation and a deployment/rollback plan for production release

## Achievements
- Delivered a fully functional, enterprise-style admissions system with zero custom code
- Reduced manual discount-approval turnaround through automated routing and reminders
- Introduced AI-assisted prioritization and risk scoring without compromising governance (data masking,
  zero data retention, audit logging, human-in-the-loop approval)

## One-Line Resume Bullet (LinkedIn/Resume header)
> Built an AI-augmented Salesforce admissions platform (Flows, Approval Processes, Agentforce) automating
> enrollment, discount approval, and applicant prioritization — 100% declarative, zero Apex.
