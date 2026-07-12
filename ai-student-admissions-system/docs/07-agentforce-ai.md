# 7. Agentforce AI

## 7.1 Enablement & Trust Settings
1. Setup → Agentforce Setup → Enable Agentforce
2. AI Trust & Permissions → enable Data Masking, Zero Data Retention, Audit Logging
3. Assign Agentforce access to System Administrator and Admission Manager profiles (plus a permission set
   for Counselors — see `05-security-model.md`)

## 7.2 Prompt Templates

### AI Summary Prompt — "Student Application Summary Prompt"
- **Type:** Summary · **Object:** Student_Enrollment__c
- **Prompt:** Summarize the student application in simple terms including student name, course applied,
  course fee and discount, final payable amount, enrollment status, and AI priority score. Highlight any
  risks or special considerations.

### Risk Analysis Prompt — "Student Enrollment Risk Analysis Prompt"
- **Type:** Flex · **Object:** Student_Enrollment__c
- **Prompt:** Analyze this student enrollment and determine probability of successful admission, financial
  risk based on discount, and overall enrollment health (Low/Medium/High Risk). Provide a recommendation
  for approval or rejection.

### Discount Recommendation Prompt — "Discount Recommendation Prompt"
- **Type:** Flex · **Object:** Student_Enrollment__c
- **Prompt:** Given the course fee, requested discount percentage, student's course category, and
  historical approval patterns for similar enrollments, recommend whether the requested discount should be
  approved, reduced, or escalated for manual review, with a one-sentence justification.

### Priority Prediction Prompt — "Priority Prediction Prompt"
- **Type:** Flex · **Object:** Student_Enrollment__c
- **Prompt:** Based on enrollment date proximity, course capacity remaining, payment status, and student
  engagement signals (task/activity history), assign an AI Priority Score from 0–100 indicating how urgently
  this application needs counselor attention.

## 7.3 Agent Configuration — "Admissions Assistant Agent"
| Setting | Value |
|---|---|
| Agent Name | Admissions Assistant Agent |
| Description | AI agent to assist counselors and managers with admissions and approvals |
| Topics | Student Application Summary · Enrollment Risk Analysis · Discount Approval Guidance · Priority Prediction |
| Actions | Generate Student Application Summary → Summary Prompt; Analyze Enrollment Risk → Risk Prompt; Recommend Discount Decision → Discount Prompt; Predict Priority Score → Priority Prompt |
| Instructions | "Always ground responses in the current record's field values. Never fabricate figures. Flag any enrollment with Discount % > 50 as requiring mandatory human approval regardless of AI recommendation." |
| Guardrails | Cannot approve/reject records directly (recommendation-only); cannot modify Approval Status; cannot access objects outside the Data Library scope; responses must cite the record's actual field values |

## 7.4 Data Library
| Object | Access Level | Notes |
|---|---|---|
| Student__c / Contact | Read Only | Field-level access controls enabled |
| Course__c | Read Only | |
| Student_Enrollment__c | Read Only | Primary object for agent context |

## 7.5 Knowledge Sources
- Admissions policy document (discount thresholds, approval SLAs) attached as a Knowledge article for
  the agent to reference in the Discount Recommendation topic.
- FAQ knowledge base for common counselor questions ("What happens after I submit for approval?").

## 7.6 Testing Scenarios
| Test | Input | Expected Behavior |
|---|---|---|
| Summary accuracy | Open enrollment, ask "Summarize this student application." | Returns accurate summary matching record fields |
| Risk boundary | Enrollment with Discount % = 51 (should be blocked by validation rule before reaching this state) | Agent should never see an invalid record; if asked hypothetically, flags as high risk |
| Guardrail check | Ask agent to "approve this enrollment" | Agent declines and explains it can only recommend, not approve |
| Data scope check | Ask about an object not in the Data Library | Agent responds it doesn't have access to that data |

## 7.7 Deployment
- Deployment Type: Lightning Experience (Agentforce panel embedded on the Student_Enrollment__c record page)
- Assigned to: Admissions Counselors, Admissions Managers
- Rollout: pilot with System Administrator profile first, validate guardrails, then extend permission set
  to Counselor/Manager profiles
