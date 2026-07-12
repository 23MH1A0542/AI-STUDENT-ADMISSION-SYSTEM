# 13. Viva / Interview Questions (100)

## A. Salesforce Fundamentals (1–15)
1. **What is Salesforce?** A cloud-based customer success platform (CRM) for sales, service, marketing, and custom app development, delivered as multi-tenant SaaS/PaaS.
2. **What is a multi-tenant architecture?** Multiple orgs share the same infrastructure and codebase while their data stays logically isolated.
3. **What is an Object in Salesforce?** A database table; Standard Objects are pre-built (Account, Contact, Opportunity); Custom Objects (suffixed `__c`) are user-defined.
4. **Difference between Standard and Custom Objects?** Standard Objects ship with Salesforce and have built-in functionality; Custom Objects are created to model unique business data like `Course__c`.
5. **What is a Custom Field?** A user-defined column added to an object to store specific data, e.g. `Discount_Percentage__c`.
6. **What is an App in Salesforce?** A collection of tabs, objects, and components grouped for a business function, e.g. the Admissions Lightning App in this project.
7. **What is a Tab?** A UI element providing access to an object's data.
8. **What is a Page Layout?** Controls which fields, related lists, and buttons appear on a record detail/edit page for a given profile/record type.
9. **What are Dynamic Forms?** A Lightning feature letting Admins place individual fields directly on a Lightning page with visibility rules, independent of the classic page layout.
10. **What is a Compact Layout?** Defines the fields shown in the highlights panel and mobile card views.
11. **What is a Record Type?** Lets a single object support different business processes, picklist values, and page layouts.
12. **What is the Object Manager?** The Setup UI for creating/managing objects, fields, and relationships.
13. **What is Field-Level Security (FLS)?** Controls whether a field is visible/editable per profile or permission set, independent of page layout placement.
14. **What is Track Field History?** An auditing feature that logs changes to selected fields over time.
15. **Why avoid Apex in this project?** Business requirements are fully achievable declaratively; declarative solutions are faster to build, easier to maintain, and don't require code deployment/testing overhead.

## B. Data Model (16–35)
16. **Why is Student_Enrollment__c master-detail to both Contact and Course__c?** To enforce that an enrollment cannot exist without a valid student and course, and to support roll-up summaries/cascading delete.
17. **Can an object have two master-detail relationships?** Yes — up to two, making it a junction object (many-to-many pattern).
18. **What happens to Student_Enrollment__c records if the parent Contact is deleted?** They are deleted too (cascade delete), unless moved to Recycle Bin recovery.
19. **Why use Lookup instead of Master-Detail for Counselor Assigned?** The User object cannot be the detail side of a master-detail relationship (master-detail can't reference User as the "master" in the required-tight-coupling sense used here) and ownership/security shouldn't cascade from User.
20. **What is a Formula Field?** A read-only field that automatically calculates a value from other fields, e.g. Final Payable Amount.
21. **How is Final Payable Amount calculated?** `Course__r.Course_Fee__c * (1 - (Discount__c / 100))`.
22. **What is an Auto Number field?** A system-generated, read-only sequential identifier, e.g. `SE-{0000}`.
23. **Difference between Picklist and Multi-Select Picklist?** Picklist allows one value; Multi-Select Picklist allows multiple values from the same list.
24. **Why is Course Fee a Currency field, not Number?** Currency fields carry currency-formatting, ISO currency codes (for multi-currency orgs), and correct decimal handling for money.
25. **What is a Percent field?** Stores a decimal internally but displays/enters as a percentage, used here for Discount Percentage.
26. **What are Validation Rules used for here?** Enforcing business constraints declaratively, e.g. blocking Course Fee ≤ 0 or Discount > 50%.
27. **What is `Course__r` in a formula?** The relationship-name notation used to traverse from the detail object to its parent's fields.
28. **What does "Allow Reports" on a custom object do?** Makes the object available as a primary object in the Reports Builder.
29. **What is Schema Builder?** A visual tool to view and edit the object model and relationships graphically.
30. **What is an External ID field?** A field marked to allow upsert operations from external systems; not used here but recommended if integrating a legacy SIS.
31. **Why track field history on Student_Enrollment__c?** For auditability of discount/approval changes, supporting compliance and dispute resolution.
32. **What's the difference between Roll-Up Summary and Formula fields?** Roll-Up Summary aggregates child records to a master-detail parent; Formula computes from fields on the same or related record.
33. **Can Roll-Up Summary work with Lookup relationships?** No — only Master-Detail relationships support standard Roll-Up Summary fields.
34. **What object stores the pre-enrollment pipeline in this project?** Opportunity, using a custom Admission Stage picklist.
35. **Why keep Account in the model if students are Contacts?** To support institution/organization-level context (e.g. corporate sponsorships) and standard Salesforce Contact-Account hierarchy behavior.

## C. Automation — Flows (36–55)
36. **What is a Record-Triggered Flow?** A flow that runs automatically when a record is created, updated, or deleted.
37. **What triggers the High Priority notification flow?** `AI_Priority_Score__c >= 80` on create or update of Student_Enrollment__c.
38. **What triggers the Discount Submission flow?** `Discount__c > 30` on Student_Enrollment__c.
39. **What is "Optimize for Actions and Related Records"?** A flow trigger optimization setting that runs the flow after the record is saved, suited for actions like sending emails or submitting for approval.
40. **What is a Scheduled-Triggered Flow?** A flow that runs on a recurring schedule (e.g. daily) rather than in response to a DML event.
41. **How does the Pending Enrollment Follow-Up flow find records?** A Get Records element filtered by `Approval_Status__c = 'Pending'` and `LastModifiedDate < TODAY() - 2`.
42. **What is a Collection Variable?** A flow variable that holds multiple records/values, iterated via a Loop element.
43. **What is a Loop element used for here?** Iterating the collection of overdue pending enrollments to send a reminder email per record.
44. **What is a Screen Flow?** A flow with interactive Screen elements that guide a user through data entry, used for the Enrollment Creation Wizard.
45. **What is an Assignment element?** Sets or updates the value of a flow variable, used to calculate Final Payable Amount mid-wizard.
46. **What is a Decision element?** Branches flow logic based on conditions, e.g. routing based on discount thresholds.
47. **Difference between Screen Flow and Record-Triggered Flow?** Screen Flow requires user interaction; Record-Triggered Flow runs automatically in the background.
48. **Can a flow call another flow?** Yes, via a Subflow element — not used in this project but a good refactor if entry-criteria logic is duplicated.
49. **What replaced Workflow Rules and Process Builder?** Flow Builder — Salesforce's unified declarative automation tool.
50. **How do you debug a flow?** Use Flow Builder's Debug feature, and review Flow Interview error emails/logs in Setup.
51. **What happens if two flows on the same object conflict?** Salesforce processes triggered flows in a defined trigger order; conflicting field updates can cause recursion or unexpected overwrites — order and scope must be planned carefully.
52. **What is Fault Path in Flow?** A branch that handles errors from an element (e.g. failed email send), allowing graceful failure handling.
53. **How do you version a flow?** Each save creates a new version; only one version can be active at a time, and older versions remain for rollback.
54. **What's the deployment default state of a Flow?** Inactive — Flows and Approval Processes are typically activated manually after Change Set deployment.
55. **Why use Get Records + Loop instead of a single aggregate query in Flow?** Flow doesn't support SQL-style aggregation directly; Get Records retrieves the record set and a Loop lets you act on each one individually.

## D. Approval Process & Validation (56–70)
56. **What is an Approval Process?** A declarative mechanism to route a record through one or more approval steps.
57. **What are the entry criteria for this project's Approval Process?** Discount % > 30 AND Enrollment Status = Submitted for Approval.
58. **Who is the approver?** Automatically assigned to the Manager of the Record Owner.
59. **What does "Administrators only can edit" mean in an Approval Process?** During the approval, only System Administrators can modify the record — protecting data integrity mid-review.
60. **What is a Final Approval Action?** An action (e.g. Field Update) executed once the record is fully approved.
61. **What is an Initial Submitter?** The user(s) permitted to submit the record for approval — set to Record Owner here.
62. **Can an Approval Process have multiple steps?** Yes; this project uses a single step, but multi-tier discount thresholds could add more steps.
63. **What is a Validation Rule?** A declarative rule that blocks a save if a formula evaluates to TRUE, showing a custom error message.
64. **Why validate Discount ≤ 50% but escalate approval at 30%?** To create a soft ceiling (30%) requiring manager sign-off and a hard ceiling (50%) that's never allowed regardless of approval.
65. **What is Error Location on a Validation Rule?** Where the error message displays — top of page or next to a specific field.
66. **Can Validation Rules reference related object fields?** Yes, via relationship syntax (e.g. `Course__r.Course_Fee__c`).
67. **What happens if a Validation Rule and a Flow both act on save?** Validation Rules fire first (before-save), blocking invalid data before Flow automation processes it.
68. **How would you allow an Admin to bypass a Validation Rule?** Add a condition checking `$Profile.Name != 'System Administrator'` or use a custom permission/bypass field.
69. **What is Approval History related list used for?** Shows the full audit trail of an approval — submitter, approver, comments, timestamps.
70. **How do you recall a submitted approval?** The submitter (or an admin) can recall it from the record's Approval History, returning it to editable state.

## E. Security Model (71–85)
71. **What is Organization-Wide Default (OWD)?** The baseline (most restrictive) sharing setting for an object before roles, sharing rules, or manual sharing widen access.
72. **Why is Student_Enrollment__c set to Private OWD?** Counselors should only see their own students' enrollments by default; broader access is explicitly granted via Role Hierarchy/Sharing Rules.
73. **What is Role Hierarchy used for?** Automatically grants users above a record owner in the hierarchy read/write access when OWD is Private or Public Read Only.
74. **Difference between Profile and Permission Set?** Profile is the mandatory baseline of permissions per user (one per user); Permission Sets grant additional permissions on top, assignable to any user regardless of profile.
75. **What is a Sharing Rule?** A declarative rule that extends record access beyond role hierarchy/OWD, based on record owner or criteria.
76. **What sharing rule is used for high-priority enrollments?** Criteria-based rule sharing records with `AI_Priority_Score__c >= 80` to the Admission Manager role (Read/Write).
77. **What is Field-Level Security vs Page Layout field visibility?** FLS is a hard security boundary enforced everywhere (API, reports); Page Layout visibility is just a UI convenience and not a security control.
78. **Can a Permission Set restrict access?** No — Permission Sets can only grant additional access, never take away what the Profile allows.
79. **What is a Permission Set Group?** A bundle of multiple Permission Sets assigned together as one unit.
80. **What are Login IP Ranges used for?** Restricting login access to trusted network ranges, e.g. institute office networks.
81. **What is Session Timeout?** Automatically logs out a user after a period of inactivity, configurable per profile/session setting.
82. **Why enforce MFA?** Salesforce requires Multi-Factor Authentication as a baseline security control against credential-based attacks.
83. **What is a Duplicate Rule vs Matching Rule?** A Matching Rule defines *how* records are compared for similarity (fields + algorithm); a Duplicate Rule defines *what happens* (block/alert) when a match is found.
84. **What matching fields identify a duplicate Student?** Email and Phone, both using Exact matching.
85. **What matching fields identify a duplicate Enrollment?** Student (Contact) and Course, both Exact match — preventing a student enrolling twice in the same course.

## F. Agentforce & AI (86–100)
86. **What is Agentforce?** Salesforce's platform for building autonomous and conversational AI agents grounded in org data.
87. **What is Prompt Builder?** A declarative tool to design reusable Prompt Templates that merge record data into an LLM prompt.
88. **Difference between a Summary Prompt Template and a Flex Prompt Template?** Summary is optimized for condensing record data into a natural-language summary; Flex allows fully custom prompt logic/output.
89. **What is a Data Library in Agentforce?** Defines which objects/fields the agent is allowed to query for grounding its responses.
90. **Why set Data Library access to Read Only?** To prevent the agent from being able to alter records directly, keeping human approval authoritative.
91. **What is a Guardrail in Agent Builder?** An explicit instruction/restriction preventing the agent from taking out-of-scope or risky actions (e.g. approving records).
92. **What is a Topic in Agentforce?** A grouping of related actions/instructions the agent uses to decide how to handle a category of user requests.
93. **What is an Action in Agent Builder?** A specific capability (often backed by a Prompt Template, Flow, or Apex) the agent can invoke to fulfill a topic.
94. **Why enable Zero Data Retention for Agentforce?** To ensure prompts/responses aren't retained by the underlying model provider beyond the immediate request — important for handling sensitive student data.
95. **What is Data Masking in AI Trust settings?** Automatically obscures sensitive field values (e.g. PII) before they're sent to the underlying LLM, where applicable.
96. **How does the agent generate a Priority Score?** Via the Priority Prediction Prompt Template, reasoning over enrollment date, course capacity, payment status, and engagement signals.
97. **Can the agent approve or reject an enrollment itself?** No — guardrails restrict it to recommendations only; a human approver must act via the Approval Process.
98. **How would you test an Agentforce agent before rollout?** Use structured test scenarios (see `10-testing.md`/`07-agentforce-ai.md`) covering accuracy, guardrail enforcement, and data-scope boundaries.
99. **What's the benefit of grounding the agent in Salesforce data vs a generic LLM?** Responses are based on real, current, permission-respecting org data rather than static/generic knowledge, reducing hallucination risk.
100. **Why deploy Agentforce to Admins first before Counselors/Managers?** To validate guardrails, data scope, and response quality in a controlled pilot before wider rollout, minimizing risk of incorrect AI-driven decisions reaching end users.
