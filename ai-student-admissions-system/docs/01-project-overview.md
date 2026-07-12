# 1. Project Overview

## Business Problem
Training institutes and educational organizations manage student admissions using spreadsheets or
disconnected point tools. There is no single source of truth for student, course, and enrollment data.

## Existing Problems
| Problem | Impact |
|---|---|
| Data scattered across spreadsheets/email | Duplication, no single source of truth |
| No role-based access control | Security and privacy risk |
| Manual discount approvals | Delays, inconsistent decisions, revenue leakage |
| No prioritization of applicants | High-value/urgent applicants get missed |
| No visibility into pipeline | Leadership can't forecast enrollments or revenue |
| Manual follow-ups | Applicants go cold, poor conversion |

## Proposed Salesforce Solution
A centralized Salesforce application built entirely with declarative tools (Flows, Approval Processes,
Validation Rules, Dynamic Forms) that manages the admissions lifecycle end-to-end, secured with a
role/profile-based sharing model, and enhanced with **Agentforce** for AI-assisted summarization, risk
scoring, and discount recommendations — with zero custom Apex.

## Business Objectives
- Centralize student, course, and enrollment data
- Automate approvals for high-discount enrollments
- Reduce manual effort in reviewing and prioritizing applications
- Provide real-time visibility via reports/dashboards
- Introduce AI-assisted decision-making without compromising governance (data masking, zero data
  retention, audit logging)

## Scope
In scope: Lead-to-enrollment lifecycle, discount approval workflow, email communication automation,
Agentforce-based summarization/risk/priority scoring, reporting, and a unified Lightning App.
Out of scope (v1): Payment gateway integration, SMS/WhatsApp integration, Experience Cloud portal (see
`17-bonus-features.md` for roadmap).

## Features
- Custom objects: `Course__c`, `Student_Enrollment__c`
- Master-detail relationships enforcing referential integrity between Student, Course, and Enrollment
- Formula field for automatic discount-adjusted fee calculation
- Approval process triggered automatically for discounts > 30%
- AI Priority Score-driven notification flow for high-priority applicants
- Screen Flow wizard for guided enrollment creation
- Agentforce agent for summary, risk analysis, and approval recommendations
- 5 role-specific dashboards (Admissions, Approvals, Revenue, Course, Counselor Performance)

## Expected Outcomes
- Faster application processing and reduced manual review time
- Consistent, policy-compliant discount approvals
- Higher conversion through AI-prioritized follow-ups
- Full auditability of every enrollment decision
