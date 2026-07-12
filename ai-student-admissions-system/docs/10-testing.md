# 10. Testing

## 10.1 Positive Test Cases
| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-01 | Create valid enrollment | Create Student_Enrollment__c with Discount 20%, valid Student & Course | Record saves, Final Payable Amount calculated correctly |
| TC-02 | High-priority notification | Set AI_Priority_Score__c = 85 | Flow fires, counselor receives email |
| TC-03 | Discount approval submission | Set Discount = 35%, Status = Submitted for Approval | Flow submits for approval, manager notified |
| TC-04 | Manager approves | Manager approves the submitted enrollment | Status = Approved, outcome email sent to counselor |
| TC-05 | Manager rejects | Manager rejects the submitted enrollment | Status = Rejected, outcome email sent |
| TC-06 | Scheduled reminder | Enrollment pending > 2 days | Daily flow sends reminder email |
| TC-07 | Screen Flow wizard | Counselor completes all 3 screens | Enrollment created successfully with correct Final Payable Amount |
| TC-08 | Agentforce summary | Ask agent to summarize a valid enrollment | Accurate summary returned, matching record data |

## 10.2 Negative Test Cases
| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-09 | Invalid course fee | Set Course_Fee__c = 0 | Validation error: "Course Fee must be greater than zero." |
| TC-10 | Past start date | Set Expected_Start_Date__c to yesterday | Validation error: "Expected Start Date cannot be in the past." |
| TC-11 | Excessive discount | Set Discount_Percentage__c = 60 | Validation error: "Discount cannot be greater than 50%." |
| TC-12 | Unauthorized edit during approval | Counselor attempts to edit enrollment while Pending Approval | Edit blocked (Admins-only editability) |
| TC-13 | Duplicate student | Create Contact with same Email/Phone as existing record | Duplicate Rule alert: "Student Email and Phone Number must be unique." |
| TC-14 | Duplicate enrollment | Create second enrollment for same Student + Course | Duplicate Rule alert: "This student is already enrolled in the selected course." |
| TC-15 | Agent guardrail violation | Ask agent to directly approve an enrollment | Agent declines, explains recommendation-only capability |

## 10.3 Boundary Test Cases
| ID | Scenario | Input | Expected Result |
|---|---|---|---|
| TC-16 | Discount at exact threshold | Discount = 30% | Does NOT trigger approval submission (rule is `> 30`) |
| TC-17 | Discount just above threshold | Discount = 30.01% / 31% | Triggers approval submission |
| TC-18 | Discount at validation ceiling | Discount = 50% | Saves successfully (rule is `> 50`) |
| TC-19 | Discount just above ceiling | Discount = 50.01% / 51% | Validation error blocks save |
| TC-20 | Priority score at threshold | AI_Priority_Score__c = 80 | Triggers high-priority notification (rule is `>= 80`) |
| TC-21 | Priority score just below threshold | AI_Priority_Score__c = 79 | Does NOT trigger notification |
| TC-22 | Pending exactly 2 days | LastModifiedDate = TODAY() - 2 | Not yet picked up (rule is `< TODAY() - 2`) |
| TC-23 | Pending just over 2 days | LastModifiedDate = TODAY() - 3 | Picked up by scheduled flow |

## 10.4 Regression Checklist (pre-deployment)
- [ ] All validation rules fire with correct messages
- [ ] Both record-triggered flows fire independently without conflict
- [ ] Approval process email templates render merge fields correctly
- [ ] Scheduled flow runs on schedule in sandbox
- [ ] Screen Flow wizard creates records with correct field mapping
- [ ] Agentforce agent respects Data Library read-only scope and guardrails
- [ ] Reports/dashboards reflect real-time data after each automation run
