# 4. Salesforce Configuration

## 4.1 Custom Objects
**Course__c**
1. Setup → Object Manager → Create → Custom Object
2. Label: `Course`, Plural Label: `Courses`, Record Name: `Course Name` (Text)
3. Enable: Allow Reports, Allow Search, Track Field History
4. Save

**Student_Enrollment__c**
1. Setup → Object Manager → Create → Custom Object
2. Label: `Student Enrollment`, Plural Label: `Student Enrollments`
3. Record Name: `Student Enrollment ID`, Type: Auto Number `SE-{0000}`, start 1
4. Enable: Allow Reports, Allow Search, Track Field History
5. Save

## 4.2 Custom Fields
Create every field listed in `03-data-model.md` under the correct object:
Object Manager → [Object] → Fields & Relationships → New → select Data Type → configure → set
Field-Level Security per profile → add to page layout → Save.

Key non-trivial fields:
- **Final Payable Amount** (Formula, Currency, 2 decimals):
  `Course__r.Course_Fee__c * (1 - (Discount__c / 100))`
- **Counselor Assigned** (Lookup → User) on Opportunity
- **Student / Course** (Master-Detail) on Student_Enrollment__c — create Student (→Contact) first, then
  Course (→Course__c); Salesforce allows only the first master-detail to control sharing/security, so
  Student is the primary master.

## 4.3 Tabs
For `Course__c` and `Student_Enrollment__c`:
Setup → Tabs → New (Custom Object Tabs) → select object → choose tab style/icon → Next → keep default
profile visibility → Next → uncheck "include tab" in default apps (added explicitly to the custom
Lightning App instead) → ensure "Append tab to users' existing personal customizations" is checked → Save.

## 4.4 Page Layouts
For Contact, Opportunity, Course__c, Student_Enrollment__c, Account:
Object Manager → [Object] → Page Layouts → open the layout → drag fields into logical sections
(e.g. "Enrollment Details", "Fee & Discount", "Approval Info") → Save.

Recommended section grouping for **Student_Enrollment__c** layout:
| Section | Fields |
|---|---|
| Identification | Student Enrollment ID, Student, Course, Enrollment Date |
| Fee & Discount | Course Fee (related), Discount Percentage, Final Payable Amount |
| Status | Enrollment Status, Approval Status, Payment Status |
| AI Insights | AI Priority Score, Risk Level |

## 4.5 Lightning Record Pages & Dynamic Forms
1. Open a Student_Enrollment__c record → Gear icon → Edit Page
2. Click the Details component → right pane → "Upgrade Now" (enables Dynamic Forms)
3. Select the Student Enrollment page layout as the field source → Finish
4. Arrange fields/sections directly on the Lightning page (independent of the classic layout)
5. Save → Activate → Assign as Org Default for Desktop and Phone
6. Repeat for Course__c, Contact, Opportunity

## 4.6 Compact Layouts
Create a compact layout per object surfacing the 4–5 most important fields (e.g. for
Student_Enrollment__c: Student, Course, Enrollment Status, Approval Status, AI Priority Score) for use in
the highlights panel and related lists.

## 4.7 Record Types (if required)
Not required for v1 (single admissions process). Recommended future addition: separate Record Types on
`Student_Enrollment__c` for "Domestic" vs "International" students if fee/approval rules diverge.
