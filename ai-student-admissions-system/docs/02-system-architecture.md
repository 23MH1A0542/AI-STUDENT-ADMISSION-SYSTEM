# 2. System Architecture

## 2.1 High-Level Architecture

```mermaid
flowchart TB
    subgraph Users
        A[Admission Counselor]
        M[Admission Manager]
        S[System Administrator]
    end

    subgraph Salesforce_Org["Salesforce Org"]
        UI[Lightning App: Admissions Console]
        DM[Data Model: Contact, Course__c, Student_Enrollment__c, Opportunity]
        AUTO[Automation: Flows, Approval Process, Validation Rules]
        SEC[Security: Profiles, Roles, Sharing Rules]
        AGENT[Agentforce: Prompt Templates + Admissions Assistant Agent]
        RPT[Reports & Dashboards]
    end

    A --> UI
    M --> UI
    S --> UI
    UI --> DM
    DM --> AUTO
    AUTO --> RPT
    UI --> AGENT
    AGENT --> DM
    SEC -.governs.-> DM
    SEC -.governs.-> UI
```

**Explanation:** Users interact only through the Lightning App. All business logic lives in declarative
automation (Flows, Approval Process, Validation Rules) sitting on top of the data model. The security
layer governs what every persona can see and do. Agentforce reads from the data model (via the Data
Library) to generate summaries and recommendations, and can write back priority/risk fields through
Flow-invoked actions. Reports & Dashboards are generated from the same data model for real-time visibility.

## 2.2 Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    ACCOUNT ||--o{ CONTACT : "has"
    CONTACT ||--o{ OPPORTUNITY : "applies via"
    CONTACT ||--o{ STUDENT_ENROLLMENT : "enrolls as"
    COURSE ||--o{ STUDENT_ENROLLMENT : "enrolled in"
    USER ||--o{ OPPORTUNITY : "counsels"
    USER ||--o{ STUDENT_ENROLLMENT : "owns"

    ACCOUNT {
        string Name
    }
    CONTACT {
        autonumber Student_ID
        picklist Education_Level
        picklist Student_Status
    }
    OPPORTUNITY {
        picklist Admission_Stage
        date Expected_Start_Date
        picklist Payment_Status
        lookup Counselor_Assigned
        currency Total_Course_Fee
    }
    COURSE {
        text Course_Code
        picklist Course_Category
        currency Course_Fee
        number Course_Duration
        picklist Course_Status
        number Capacity
    }
    STUDENT_ENROLLMENT {
        masterdetail Student
        masterdetail Course
        date Enrollment_Date
        percent Discount_Percentage
        formula Final_Payable_Amount
        picklist Enrollment_Status
        picklist Approval_Status
        picklist Payment_Status
        number AI_Priority_Score
        text Risk_Level
    }
```

**Explanation:** `Student_Enrollment__c` is the transactional core, master-detail to both `Contact`
(Student) and `Course__c`. This enforces that an enrollment cannot exist without its parent student and
course, and lets rollups/reporting roll up cleanly. `Opportunity` tracks the pre-enrollment sales/admission
pipeline (Inquiry → Applied → Enrolled) and is where the counselor and expected revenue are tracked before
conversion.

## 2.3 Data Flow Diagram

```mermaid
flowchart LR
    Lead[Prospective Student Inquiry] --> Contact[Contact Record Created]
    Contact --> Opp[Opportunity: Admission Stage = Inquiry]
    Opp -->|Qualifies| App[Application: Stage = Applied]
    App --> Enroll[Student_Enrollment__c Created - Draft]
    Enroll -->|AI_Priority_Score >= 80| Notify[Flow: Notify Counselor - High Priority]
    Enroll -->|Discount__c > 30%| Submit[Flow: Submit for Approval]
    Submit --> Approval[Approval Process: Manager Review]
    Approval -->|Approved| Approved[Enrollment_Status = Approved]
    Approval -->|Rejected| Rejected[Enrollment_Status = Rejected]
    Approved --> Reports[Reports & Dashboards]
    Rejected --> Reports
    Enroll -.queried by.-> Agent[Agentforce: Summary / Risk / Recommendation]
    Agent -.writes back.-> Enroll
```

**Explanation:** Data flows left to right from first inquiry through to a final enrollment decision, with
two automation branches firing off the same `Student_Enrollment__c` record: a priority-notification branch
(AI-scored) and a discount-approval branch (business-rule-driven). Agentforce sits alongside the record,
reading it for context and optionally writing recommendations back onto priority/risk fields.

## 2.4 Object Relationship Diagram

```mermaid
classDiagram
    class Account
    class Contact {
        +Student_ID
        +Education_Level
        +Student_Status
    }
    class Opportunity {
        +Admission_Stage
        +Counselor_Assigned
    }
    class Course__c {
        +Course_Code
        +Course_Fee
        +Capacity
    }
    class Student_Enrollment__c {
        +Discount_Percentage
        +Final_Payable_Amount
        +Approval_Status
        +AI_Priority_Score
    }
    class User

    Account "1" --> "many" Contact : Household/Org
    Contact "1" --> "many" Opportunity : Applications
    Contact "1" --> "many" Student_Enrollment__c : Master-Detail
    Course__c "1" --> "many" Student_Enrollment__c : Master-Detail
    User "1" --> "many" Opportunity : Counselor Assigned (Lookup)
    User "1" --> "many" Student_Enrollment__c : Record Owner
```

## 2.5 Process Flow Diagram — Discount Approval

```mermaid
sequenceDiagram
    participant C as Counselor
    participant SE as Student_Enrollment__c
    participant F as Flow (Record-Triggered)
    participant AP as Approval Process
    participant M as Manager
    participant E as Email Alert

    C->>SE: Creates/updates enrollment (Discount % = 35)
    SE->>F: Record saved, entry criteria evaluated
    F->>AP: Submit for Approval (Discount > 30)
    AP->>E: Send "Awaiting Approval" email
    E->>M: Manager notified
    M->>AP: Approve / Reject
    AP->>SE: Field Update: Enrollment_Status__c
    AP->>E: Send outcome email
    E->>C: Counselor notified of decision
```
