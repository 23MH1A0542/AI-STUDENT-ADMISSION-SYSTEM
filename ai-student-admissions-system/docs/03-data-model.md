# 3. Salesforce Data Model

## 3.1 Standard Object: Account
**Description:** Represents the institution/organization side of a relationship where relevant (e.g.
corporate-sponsored students, partner organizations). Used mainly as the parent for Contact where an
account context is needed.

| Field | Type | Required | Notes |
|---|---|---|---|
| Name | Text (Standard) | Yes | Organization/household name |

**Relationships:** Account (1) → Contact (Many), standard lookup.
**Validation Rules:** None required beyond standard.

## 3.2 Standard Object: Contact ("Student")
**Description:** Represents the student. Extended with admissions-specific fields.

| Field | Data Type | Required | Notes |
|---|---|---|---|
| Student ID | Auto Number `S-{0000}` | Yes | Unique student identifier, starts at 1 |
| Education Level | Picklist (Graduate, UG, Diploma) | Yes | Academic background |
| Student Status | Picklist (New, Enrolled, Completed) | Yes | Lifecycle stage |

**Relationships:** Contact (1) → Opportunity (Many); Contact (1) → Student_Enrollment__c (Many, Master-Detail).
**Validation Rules:** None at Contact level (validation lives on Opportunity/Enrollment).

## 3.3 Standard Object: Opportunity ("Application")
**Description:** Tracks the pre-enrollment pipeline stage for a student's application to a program.

| Field | Data Type | Required | Notes |
|---|---|---|---|
| Admission Stage | Picklist (Inquiry, Applied, Enrolled) | Yes | Pipeline stage |
| Expected Start Date | Date | Yes | Planned course start |
| Payment Status | Picklist (Pending, Paid, Partial) | Yes | |
| Counselor Assigned | Lookup (User) | Yes | Owning counselor |
| Total Course Fee | Currency | Yes | Full fee before discount |

**Relationships:** Opportunity (Many) → Contact (1); Opportunity (Many) → User (1, via Counselor Assigned lookup).

**Validation Rules:**
| Rule Name | Formula | Error Message |
|---|---|---|
| Start Date Validation | `Expected_Start_Date__c < TODAY()` | "Expected Start Date cannot be in the past." |

## 3.4 Standard Object: User
**Description:** Standard Salesforce User object — represents counselors, managers, and admins. No custom
fields added; used as lookup target for Counselor Assigned and as record owner.

## 3.5 Custom Object: `Course__c`
**Description:** Represents a course/program offered by the institute.

| Field | Data Type | Required | Notes |
|---|---|---|---|
| Course Name (Record Name) | Text | Yes | Standard name field |
| Course Code | Text | Yes | Unique short code |
| Course Category | Picklist (Technical, Non Technical) | Yes | |
| Course Fee | Currency | Yes | Base fee before discount |
| Course Duration | Number | Yes | In weeks/months |
| Course Status | Picklist (Active, Inactive) | Yes | Controls availability |
| Capacity | Number | Yes | Max seats |

**Object Settings:** Allow Reports ✅, Allow Search ✅, Track Field History ✅.

**Validation Rules:**
| Rule Name | Formula | Error Message |
|---|---|---|
| Course Fee Validation | `Course_Fee__c <= 0` | "Course Fee must be greater than zero." |

**Relationships:** Course__c (1) → Student_Enrollment__c (Many, Master-Detail).

## 3.6 Custom Object: `Student_Enrollment__c`
**Description:** The transactional core object — one record per student-course enrollment.

| Field | Data Type | Required | Notes |
|---|---|---|---|
| Student Enrollment ID (Record Name) | Auto Number `SE-{0000}` | Yes | Starts at 1 |
| Student | Master-Detail (Contact) | Yes | Parent 1 |
| Course | Master-Detail (Course__c) | Yes | Parent 2 |
| Enrollment Date | Date | Yes | |
| Discount Percentage | Percent | Yes | 0–100 |
| Final Payable Amount | Formula (Currency) | — | `Course__r.Course_Fee__c * (1 - (Discount__c / 100))` |
| Enrollment Status | Picklist (Draft, Pending Approval, Approved) | Yes | |
| Approval Status | Picklist (Pending, Approved, Rejected) | Yes | |
| Payment Status | Picklist (Paid, Pending) | Yes | |
| AI Priority Score | Number (0–100) | No | Written by Agentforce/Flow |
| Risk Level | Text/Picklist (Low, Medium, High) | No | Written by Agentforce |

**Object Settings:** Allow Reports ✅, Allow Search ✅, Track Field History ✅.

**Validation Rules:**
| Rule Name | Formula | Error Message |
|---|---|---|
| Discount Percent Validation | `Discount_Percentage__c > 50` | "Discount cannot be greater than 50%." |

**Relationships:** Student_Enrollment__c (Many) → Contact (1); Student_Enrollment__c (Many) → Course__c (1).

## 3.7 Relationship Summary

| Parent | Child | Type | Cascade Delete |
|---|---|---|---|
| Account | Contact | Lookup (standard) | No |
| Contact | Opportunity | Lookup (standard) | No |
| Contact | Student_Enrollment__c | Master-Detail | Yes |
| Course__c | Student_Enrollment__c | Master-Detail | Yes |
| User | Opportunity | Lookup (Counselor Assigned) | No |
