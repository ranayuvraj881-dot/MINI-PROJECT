import { AssignmentItem } from '../../types';

export const mockAssignmentsList: AssignmentItem[] = [
  {
    id: 'asg-01',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    title: 'B+ Tree Indexing & 3NF/BCNF Decomposition',
    description: 'Implement B+ Tree leaf node splitting algorithm in Python/C++ and perform full dependency-preserving BCNF decomposition on the given university schema.',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    assignedDate: '2026-03-05',
    dueDate: '2026-03-15',
    status: 'Pending',
    priority: 'HIGH PRIORITY',
    maxMarks: 25
  },
  {
    id: 'asg-02',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    title: 'Banker’s Deadlock Avoidance Algorithm Simulation',
    description: 'Develop a simulation for multi-resource Banker’s Algorithm to determine safe sequences and handle dynamic resource requests with matrix state outputs.',
    facultyName: 'Prof. Meenakshi Sundaram',
    assignedDate: '2026-03-06',
    dueDate: '2026-03-18',
    status: 'Pending',
    priority: 'HIGH PRIORITY',
    maxMarks: 20
  },
  {
    id: 'asg-03',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    title: 'LALR(1) Parsing Table Construction & Shift-Reduce Conflicts',
    description: 'Construct canonical collection of LR(1) items and compress into LALR(1) parsing table for arithmetic expression grammar with ambiguity resolution.',
    facultyName: 'Dr. Arvind Kumar Pandey',
    assignedDate: '2026-03-02',
    dueDate: '2026-03-14',
    status: 'Pending',
    priority: 'HIGH PRIORITY',
    maxMarks: 20
  },
  {
    id: 'asg-04',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    title: 'Support Vector Classifier on Breast Cancer Dataset',
    description: 'Train linear and RBF kernel SVM classifiers using scikit-learn, plot decision boundaries, and evaluate precision-recall curves with 5-fold cross-validation.',
    facultyName: 'Dr. Priyanka Rastogi',
    assignedDate: '2026-03-08',
    dueDate: '2026-03-22',
    status: 'Pending',
    priority: 'MEDIUM PRIORITY',
    maxMarks: 20
  },
  {
    id: 'asg-05',
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology & Cloud Applications',
    title: 'FastAPI Microservice with JWT Authentication',
    description: 'Build a modular REST API with FastAPI, Pydantic schemas, SQLite/PostgreSQL connection, and bearer token protection for college club registration.',
    facultyName: 'Prof. Ankit Verma',
    assignedDate: '2026-02-22',
    dueDate: '2026-03-04',
    status: 'Submitted',
    priority: 'NORMAL',
    submittedDate: '2026-03-03',
    marksObtained: 24,
    maxMarks: 25
  },
  {
    id: 'asg-06',
    subjectCode: 'KCS-651',
    subjectName: 'Database Management Systems Lab',
    title: 'Stored Procedures and Audit Triggers in PostgreSQL',
    description: 'Create an automatic audit table trigger recording user mutations, salary caps, and historical employee department transfers.',
    facultyName: 'Er. Rohitashwa Saxena',
    assignedDate: '2026-02-18',
    dueDate: '2026-03-01',
    status: 'Submitted',
    priority: 'NORMAL',
    submittedDate: '2026-02-28',
    marksObtained: 19,
    maxMarks: 20
  },
  {
    id: 'asg-07',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    title: 'Extended ER Diagram for Campus Fleet Management',
    description: 'Draft extended ER diagram showcasing specialization, generalization, aggregation, and total participation constraints.',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    assignedDate: '2026-02-10',
    dueDate: '2026-02-20',
    status: 'Overdue',
    priority: 'MEDIUM PRIORITY',
    maxMarks: 15
  }
];
