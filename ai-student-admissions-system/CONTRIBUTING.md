# Contributing

This is a **declarative Salesforce project** — all "code changes" are configuration changes made in a
Salesforce sandbox, not commits to source files (unless the org is connected via Salesforce DX/CLI to
track metadata as source).

## How to Propose a Change
1. Open an issue describing the change (new field, new flow branch, new dashboard, etc.) and reference the
   relevant doc in `docs/`.
2. Build and test the change in a sandbox.
3. Update the relevant markdown file(s) in `docs/` to reflect the new configuration (keep docs in sync with
   the org — this repo is the source of truth for *why* something is configured a certain way).
4. If using Salesforce DX, retrieve the changed metadata into the local source tree and submit a pull
   request; otherwise, attach a Change Set export summary to your PR/issue for traceability.
5. Get review from another admin/architect before deploying to a shared sandbox or production.

## Style Guide
- Follow Salesforce naming conventions: PascalCase for objects/fields (`Student_Enrollment__c`), sentence
  case for labels ("Student Enrollment").
- Every new automation component should be documented in `docs/06-automation.md` with entry criteria and
  actions.
- Every new field must be added to the relevant table in `docs/03-data-model.md`.
- Security-impacting changes (new profile, permission set, sharing rule) must update `docs/05-security-model.md`.
