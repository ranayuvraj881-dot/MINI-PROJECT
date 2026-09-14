import { AcademicRiskReport, ChatMessage, DayStudyPlan } from '../../types';

export const mockSuggestedPrompts = [
  'Explain DBMS normalization.',
  'Give me PYQs for Operating Systems Unit 3.',
  'Create a 5-day study plan.',
  'Why is my attendance at risk?',
  'What should I study today?',
  'Summarize my DBMS notes.'
];

export const mockCopilotContexts = [
  { id: 'notes', label: 'My Notes', icon: 'FileText', description: 'Search and cite unit notes uploaded by faculty' },
  { id: 'subjects', label: 'My Subjects', icon: 'BookOpen', description: 'Curriculum, syllabus & course outcomes' },
  { id: 'pyqs', label: 'My PYQs', icon: 'GraduationCap', description: 'AKTU & GL Bajaj past 5-year exam questions' },
  { id: 'academic_data', label: 'My Academic Data', icon: 'Activity', description: 'Current marks, internal sessional scores & attendance' },
  { id: 'college_info', label: 'College Information', icon: 'Building2', description: 'Academic calendar, rules, and departmental notices' }
];

export const mockInitialChatHistory: ChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'assistant',
    content: `Hello Yashvardhan! I am **Campus AI**, your personal academic copilot for **GL Bajaj Institute of Technology & Management**.

I have indexed your Semester VI syllabus, active faculty lecture notes, 5-year AKTU PYQ datasets, and your current attendance & internal performance records.

How can I help you excel today? You can choose a context above or tap one of the suggested academic inquiries below.`,
    timestamp: 'Today at 08:30 AM',
    contextApplied: 'All Academic Contexts'
  },
  {
    id: 'msg-02',
    sender: 'user',
    content: 'Why is my attendance at risk?',
    timestamp: 'Today at 08:31 AM',
    contextApplied: 'My Academic Data'
  },
  {
    id: 'msg-03',
    sender: 'assistant',
    content: `Based on your official ERP records as of today:

1. **Database Management Systems (KCS-601)** is currently at **73.0%** (35 attended out of 48 total classes delivered).
2. The mandatory institute requirement is **75.0%**.
3. **Recovery Trajectory**: You need to attend the next **2 consecutive classes** (scheduled today at 09:00 AM with Dr. Sanjeev Kumar Sharma and tomorrow) without missing any session. Doing so will restore your DBMS standing to **75.5% (Safe)**.
4. All other subjects (Operating Systems at 88.0%, Web Tech at 85.0%, Compiler Design at 77.2%) remain in the safe zone.`,
    timestamp: 'Today at 08:31 AM',
    contextApplied: 'My Academic Data',
    suggestedFollowups: [
      'Open Attendance Simulator',
      'Show my DBMS lecture schedule',
      'What happens if I miss today’s 9:00 AM class?'
    ]
  }
];

export const mockSampleResponses: { [key: string]: string } = {
  'explain dbms normalization.': `### Database Normalization (AKTU KCS-601 Unit 3)

Normalization is the systematic process of organizing relational schemas to eliminate data redundancy, prevent update/insertion/deletion anomalies, and ensure data integrity through functional dependencies.

#### Key Normal Forms:
1. **First Normal Form (1NF)**:
   - Each column contains atomic (indivisible) values.
   - No repeating groups or multi-valued attributes.
2. **Second Normal Form (2NF)**:
   - Must be in 1NF.
   - No **partial functional dependencies** (no non-prime attribute should depend on a proper subset of any candidate key).
3. **Third Normal Form (3NF)**:
   - Must be in 2NF.
   - No **transitive dependencies** ($X \\rightarrow Y$, where neither $X$ is a superkey nor $Y$ is a prime attribute).
4. **Boyce-Codd Normal Form (BCNF)**:
   - Stricter than 3NF.
   - For every non-trivial functional dependency $X \\rightarrow Y$, **$X$ must be a superkey**.

**Exam Tip**: In AKTU End-Sem papers, Normalization has been asked **8 times in the last 5 years** with an average weightage of 10 marks. Be prepared with numerical decomposition steps!`,

  'give me pyqs for operating systems unit 3.': `### High-Frequency PYQs for Operating Systems (Unit 3: Deadlocks)

Compiled from AKTU End-Sem examinations (2020 - 2024) for GL Bajaj B.Tech CSE:

1. **Deadlock Conditions & Characterization** *(2024 End-Sem, 7 Marks)*:
   - State and explain the four Coffman conditions necessary for deadlock occurrence: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.
2. **Banker’s Algorithm Numerical** *(2024 & 2022 End-Sem, 10 Marks)*:
   - Given matrices for Allocation, Max, and Available vectors across 5 processes ($P_0$ to $P_4$) and 3 resource types ($A, B, C$), determine if the system is in a safe state. State the safe sequence.
3. **Deadlock Prevention vs Avoidance** *(2023 End-Sem, 7 Marks)*:
   - Compare prevention techniques (denying Coffman conditions) with dynamic avoidance (Banker's Algorithm and Resource Allocation Graphs).

Would you like me to open the step-by-step solution for the Banker’s Algorithm?`,

  'create a 5-day study plan.': `### Personalized 5-Day Academic Study Plan

Generated based on your weak areas (DBMS Normalization & Compiler LR Parsing) and upcoming internal assessments:

- **Day 1 (Monday)**:
  - 06:00 PM – 06:45 PM: DBMS — Normal Forms (1NF, 2NF, 3NF, BCNF)
  - 07:00 PM – 07:30 PM: Solve 5 AKTU Normalization PYQs
  - 08:00 PM – 08:30 PM: Operating Systems — Deadlock Banker's Algorithm
- **Day 2 (Tuesday)**:
  - 06:00 PM – 07:00 PM: Compiler Design — Canonical Collection of LR(0) Items
  - 07:15 PM – 08:00 PM: Machine Learning — SVM Hyperplane formulation
- **Day 3 (Wednesday)**:
  - 06:00 PM – 07:00 PM: DBMS — Transaction ACID & 2-Phase Locking Protocols
  - 07:15 PM – 08:00 PM: Web Technology — Asynchronous Fetch & Promises
- **Day 4 (Thursday)**:
  - 06:00 PM – 07:00 PM: Compiler Design — LALR Table & Conflict Resolution
  - 07:15 PM – 08:15 PM: Operating Systems — Paging & Virtual Memory Numerical
- **Day 5 (Friday)**:
  - 06:00 PM – 07:30 PM: Full Mock Revision on High-Frequency Topics
  - 07:45 PM – 08:30 PM: Pending Assignment Completion check

Would you like to sync this schedule directly into your **CampusOS Study Planner**?`,

  'what should i study today?': `### Priority Recommendation for Yashvardhan Today

Based on your current risk index and upcoming deadlines:

1. **Immediate Focus**: Revise **DBMS Normalization** for 40 minutes and solve 5 related PYQs. (Your internal quiz is in 4 days and this topic represents 22% of Unit 3 exam weight).
2. **Assignment Action**: Complete the pending **Compiler Design LALR(1) Parsing Table** assignment (Due tomorrow, March 14).
3. **Class Reminder**: You have DBMS lecture at 09:00 AM today in AB-1 Room 304 with Dr. Sanjeev Kumar Sharma. Attending this is critical to bring your attendance back to safety.`,

  'summarize my dbms notes.': `### Summary: Unit 3 DBMS Classroom Notes (Dr. Sanjeev Kumar Sharma)

- **Functional Dependencies ($X \\rightarrow Y$)**: Integrity constraint where attribute values of $X$ uniquely identify $Y$.
- **Armstrong’s Axioms**: Reflexivity, Augmentation, and Transitivity (along with derived rules: Decomposition, Union, Pseudo-transitivity).
- **Canonical Cover ($F_c$)**: Minimal set of FDs with no extraneous attributes and minimal LHS/RHS.
- **Decomposition Properties**:
  - *Lossless-Join Decomposition*: $R_1 \\cap R_2 \\rightarrow R_1$ or $R_1 \\cap R_2 \\rightarrow R_2$.
  - *Dependency Preservation*: $(F_1 \\cup F_2)^+ = F^+$.
- **3NF vs BCNF Trade-off**: BCNF guarantees zero redundancy from functional dependencies, but is not always dependency-preserving; 3NF is always dependency-preserving and lossless.`
};

export const mockDefaultStudyPlan: DayStudyPlan[] = [
  {
    day: 'Monday',
    date: 'March 16, 2026',
    focusArea: 'Database Systems & OS Deadlocks',
    targetHours: 2.25,
    slots: [
      {
        id: 'slot-1',
        timeSlot: '06:00 PM – 06:45 PM',
        subjectName: 'Database Management Systems',
        subjectCode: 'KCS-601',
        topic: 'Normalization (3NF and BCNF Decomposition)',
        taskType: 'Revision',
        completed: true
      },
      {
        id: 'slot-2',
        timeSlot: '07:00 PM – 07:30 PM',
        subjectName: 'Database Management Systems',
        subjectCode: 'KCS-601',
        topic: '5 High-Frequency Normalization PYQs',
        taskType: 'PYQ Practice',
        completed: false
      },
      {
        id: 'slot-3',
        timeSlot: '08:00 PM – 08:30 PM',
        subjectName: 'Operating Systems',
        subjectCode: 'KCS-602',
        topic: 'Banker’s Algorithm Safety Sequence',
        taskType: 'Problem Solving',
        completed: false
      }
    ]
  },
  {
    day: 'Tuesday',
    date: 'March 17, 2026',
    focusArea: 'Compiler Design & Parser Construction',
    targetHours: 2.0,
    slots: [
      {
        id: 'slot-4',
        timeSlot: '06:00 PM – 07:00 PM',
        subjectName: 'Compiler Design',
        subjectCode: 'KCS-603',
        topic: 'Canonical Collection of LR(1) Items & Propagation',
        taskType: 'Revision',
        completed: false
      },
      {
        id: 'slot-5',
        timeSlot: '07:15 PM – 08:15 PM',
        subjectName: 'Machine Learning Techniques',
        subjectCode: 'KOE-064',
        topic: 'Support Vector Machines Decision Boundary',
        taskType: 'Problem Solving',
        completed: false
      }
    ]
  },
  {
    day: 'Wednesday',
    date: 'March 18, 2026',
    focusArea: 'Transactions & Web APIs',
    targetHours: 2.0,
    slots: [
      {
        id: 'slot-6',
        timeSlot: '06:00 PM – 07:00 PM',
        subjectName: 'Database Management Systems',
        subjectCode: 'KCS-601',
        topic: 'Strict 2-Phase Locking & Serializability Graphs',
        taskType: 'Revision',
        completed: false
      },
      {
        id: 'slot-7',
        timeSlot: '07:15 PM – 08:15 PM',
        subjectName: 'Web Technology & Cloud Applications',
        subjectCode: 'KIT-601',
        topic: 'FastAPI Router & Pydantic Validation Schemas',
        taskType: 'Lab Exercise',
        completed: false
      }
    ]
  }
];

export const mockAcademicRiskReport: AcademicRiskReport = {
  overallRisk: 'MEDIUM',
  score: 42, // 0-100 where >60 is High Risk, 35-60 is Medium, <35 is Safe
  title: 'Moderate Academic Health Advisory',
  whyExplanation: 'Your DBMS attendance (73.0%) is currently 2% below the mandatory 75% university eligibility threshold, coupled with a 3% dip in your latest Compiler Design assessment and an upcoming assignment deadline.',
  factors: [
    {
      id: 'rf-1',
      factor: 'Attendance',
      status: 'Critical',
      value: '73.0% (DBMS)',
      impactScore: 78,
      detail: 'Below the 75% threshold in KCS-601. Requires attending the next 2 consecutive classes to reach safe status.'
    },
    {
      id: 'rf-2',
      factor: 'Internal Marks',
      status: 'Safe',
      value: '84.2% Aggregate',
      impactScore: 22,
      detail: 'Consistent internal test performance across core subjects, with minor dip in Compiler Design (76.5%).'
    },
    {
      id: 'rf-3',
      factor: 'Assignment Completion',
      status: 'Warning',
      value: '3 Pending Assignments',
      impactScore: 48,
      detail: 'High-priority assignment in Compiler Design due in 24 hours. DBMS B+ Tree assignment due in 48 hours.'
    },
    {
      id: 'rf-4',
      factor: 'Quiz Performance',
      status: 'Safe',
      value: '88% Average',
      impactScore: 18,
      detail: 'Quiz score trajectory has shown an upward rebound in DBMS by +12%.'
    }
  ],
  recommendedActions: [
    {
      id: 'act-1',
      action: 'Attend upcoming DBMS classes today (09:00 AM) and tomorrow to restore 75% eligibility.',
      priority: 'Immediate',
      subject: 'KCS-601'
    },
    {
      id: 'act-2',
      action: 'Submit the Compiler Design LALR(1) assignment before the deadline tomorrow.',
      priority: 'Immediate',
      subject: 'KCS-603'
    },
    {
      id: 'act-3',
      action: 'Revise DBMS Normalization (Unit 3) and practice 5 high-frequency AKTU PYQs.',
      priority: 'Important',
      subject: 'KCS-601'
    }
  ]
};
