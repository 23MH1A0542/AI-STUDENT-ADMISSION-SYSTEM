# 8. Reports & Dashboards

## 8.1 Admissions Dashboard
| Component | Type | Grouping | KPI |
|---|---|---|---|
| Applications by Stage | Donut Chart | Admission Stage | Total count |
| Applications Over Time | Line Chart | Created Date (by week) | Trend |
| Enrollment Status Breakdown | Bar Chart | Enrollment Status | Count by status |
| Total Applications | Metric | — | Single number KPI |

**Filters:** Date range (Last 30/90 days), Course Category.

## 8.2 Pending Approvals Dashboard
| Component | Type | Grouping | KPI |
|---|---|---|---|
| Pending Approvals by Manager | Bar Chart | Manager (Owner's Role) | Count pending |
| Aging of Pending Approvals | Table | Days Since Submission (bucketed 0-2, 3-5, 6+) | Count |
| Average Approval Turnaround | Metric | — | Avg days to decision |

**Filters:** Approval Status = Pending, Discount % range.

## 8.3 Revenue Dashboard
| Component | Type | Grouping | KPI |
|---|---|---|---|
| Revenue by Course | Bar Chart | Course Name | Sum of Final Payable Amount |
| Revenue by Month | Line Chart | Enrollment Date (by month) | Sum of Final Payable Amount |
| Discount Impact | Gauge | — | Total Discount Given vs Total Course Fee |
| Total Revenue (Approved) | Metric | — | Sum, filtered Approval Status = Approved |

**Filters:** Payment Status, Approval Status, Course Category.

## 8.4 Course Dashboard
| Component | Type | Grouping | KPI |
|---|---|---|---|
| Enrollment vs Capacity | Bar Chart | Course Name | Enrolled count vs Capacity field |
| Course Popularity | Donut Chart | Course Category | Count of enrollments |
| Active vs Inactive Courses | Metric x2 | Course Status | Count |

**Filters:** Course Status, Course Category.

## 8.5 Counselor Performance Dashboard
| Component | Type | Grouping | KPI |
|---|---|---|---|
| Enrollments by Counselor | Bar Chart | Owner | Count of enrollments |
| Conversion Rate | Table | Owner | Enrolled / Total Applications % |
| Average Discount Given | Metric | Owner | Avg Discount % |
| High Priority Applications Handled | Bar Chart | Owner | Count where AI Priority Score ≥ 80 |

**Filters:** Date range, Role (Counselor vs Manager view via folder sharing).

## 8.6 Report Folder & Sharing
| Folder | Shared With |
|---|---|
| Admissions Reports – Counselor | Admission Counselor role and above |
| Admissions Reports – Management | Admission Manager role and above (Revenue, Counselor Performance) |
