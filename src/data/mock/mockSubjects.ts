export interface SubjectOverview {
  code: string;
  name: string;
  shortName: string;
  credits: number;
  faculty: string;
  room: string;
  category: 'Core Theory' | 'Professional Elective' | 'Open Elective' | 'Laboratory';
  attendancePercentage: number;
  attendanceStatus: 'Safe' | 'At Risk' | 'Critical';
  currentScore: number;
  maxScore: number;
  gradeProjected: string;
  units: {
    unitNumber: number;
    title: string;
    topicsCount: number;
    pyqCount: number;
    notesCount: number;
  }[];
}

export const mockSubjects: SubjectOverview[] = [
  {
    code: 'KCS-601',
    name: 'Database Management Systems',
    shortName: 'DBMS',
    credits: 4,
    faculty: 'Dr. Sanjeev Kumar Sharma',
    room: 'AB-1, Room 304',
    category: 'Core Theory',
    attendancePercentage: 73.0,
    attendanceStatus: 'At Risk',
    currentScore: 74,
    maxScore: 100,
    gradeProjected: 'B+',
    units: [
      { unitNumber: 1, title: 'Introduction to Database & ER Model', topicsCount: 14, pyqCount: 12, notesCount: 4 },
      { unitNumber: 2, title: 'Relational Model, Algebra & Calculus', topicsCount: 16, pyqCount: 15, notesCount: 5 },
      { unitNumber: 3, title: 'Database Design & Relational Normalization', topicsCount: 18, pyqCount: 22, notesCount: 6 },
      { unitNumber: 4, title: 'Transaction Processing & Concurrency Control', topicsCount: 15, pyqCount: 19, notesCount: 5 },
      { unitNumber: 5, title: 'Crash Recovery, Indexing & B+ Trees', topicsCount: 12, pyqCount: 14, notesCount: 3 }
    ]
  },
  {
    code: 'KCS-602',
    name: 'Operating Systems',
    shortName: 'OS',
    credits: 4,
    faculty: 'Prof. Meenakshi Sundaram',
    room: 'AB-2, Room 108',
    category: 'Core Theory',
    attendancePercentage: 88.0,
    attendanceStatus: 'Safe',
    currentScore: 86,
    maxScore: 100,
    gradeProjected: 'A',
    units: [
      { unitNumber: 1, title: 'OS Services, System Calls & Process Management', topicsCount: 15, pyqCount: 11, notesCount: 4 },
      { unitNumber: 2, title: 'CPU Scheduling & Process Synchronization', topicsCount: 17, pyqCount: 18, notesCount: 6 },
      { unitNumber: 3, title: 'Deadlocks: Prevention, Avoidance & Recovery', topicsCount: 12, pyqCount: 16, notesCount: 4 },
      { unitNumber: 4, title: 'Memory Management, Paging & Virtual Memory', topicsCount: 16, pyqCount: 20, notesCount: 5 },
      { unitNumber: 5, title: 'File Systems, I/O Subsystems & Disk Scheduling', topicsCount: 14, pyqCount: 13, notesCount: 4 }
    ]
  },
  {
    code: 'KCS-603',
    name: 'Compiler Design',
    shortName: 'CD',
    credits: 4,
    faculty: 'Dr. Arvind Kumar Pandey',
    room: 'AB-1, Room 202',
    category: 'Core Theory',
    attendancePercentage: 76.5,
    attendanceStatus: 'Safe',
    currentScore: 78,
    maxScore: 100,
    gradeProjected: 'B+',
    units: [
      { unitNumber: 1, title: 'Lexical Analysis & Regular Expressions', topicsCount: 12, pyqCount: 10, notesCount: 3 },
      { unitNumber: 2, title: 'Syntax Analysis & Parsing (LL, LR, LALR)', topicsCount: 20, pyqCount: 24, notesCount: 7 },
      { unitNumber: 3, title: 'Syntax Directed Translation (SDT)', topicsCount: 14, pyqCount: 15, notesCount: 4 },
      { unitNumber: 4, title: 'Intermediate Code Generation & Type Checking', topicsCount: 13, pyqCount: 12, notesCount: 4 },
      { unitNumber: 5, title: 'Code Optimization & Code Generation', topicsCount: 15, pyqCount: 16, notesCount: 5 }
    ]
  },
  {
    code: 'KOE-064',
    name: 'Machine Learning Techniques',
    shortName: 'MLT',
    credits: 3,
    faculty: 'Dr. Priyanka Rastogi',
    room: 'AB-3, Seminar Hall 2',
    category: 'Professional Elective',
    attendancePercentage: 81.0,
    attendanceStatus: 'Safe',
    currentScore: 84,
    maxScore: 100,
    gradeProjected: 'A',
    units: [
      { unitNumber: 1, title: 'Foundations of ML, Supervised Learning & Regression', topicsCount: 16, pyqCount: 14, notesCount: 5 },
      { unitNumber: 2, title: 'Classification: Logistic, SVM & Decision Trees', topicsCount: 18, pyqCount: 18, notesCount: 6 },
      { unitNumber: 3, title: 'Unsupervised Learning, Clustering & Dimensionality Reduction', topicsCount: 14, pyqCount: 13, notesCount: 4 },
      { unitNumber: 4, title: 'Neural Networks & Deep Learning Essentials', topicsCount: 15, pyqCount: 15, notesCount: 5 },
      { unitNumber: 5, title: 'Model Evaluation, Bias-Variance & Ensemble Methods', topicsCount: 12, pyqCount: 11, notesCount: 3 }
    ]
  },
  {
    code: 'KIT-601',
    name: 'Web Technology & Cloud Applications',
    shortName: 'WT',
    credits: 3,
    faculty: 'Prof. Ankit Verma',
    room: 'Lab Complex 4, System Lab 12',
    category: 'Core Theory',
    attendancePercentage: 84.2,
    attendanceStatus: 'Safe',
    currentScore: 89,
    maxScore: 100,
    gradeProjected: 'A+',
    units: [
      { unitNumber: 1, title: 'HTML5, CSS3, DOM & Modern JavaScript', topicsCount: 15, pyqCount: 10, notesCount: 5 },
      { unitNumber: 2, title: 'Asynchronous JS, Fetch, AJAX & Web Sockets', topicsCount: 13, pyqCount: 12, notesCount: 4 },
      { unitNumber: 3, title: 'Server-side Scripting & REST API Engineering', topicsCount: 17, pyqCount: 16, notesCount: 6 },
      { unitNumber: 4, title: 'Database Integration, ORMs & Session Security', topicsCount: 14, pyqCount: 14, notesCount: 4 },
      { unitNumber: 5, title: 'Cloud Deployment, Microservices & Dockerization', topicsCount: 12, pyqCount: 9, notesCount: 4 }
    ]
  },
  {
    code: 'KCS-651',
    name: 'Database Management Systems Lab',
    shortName: 'DBMS Lab',
    credits: 1,
    faculty: 'Er. Rohitashwa Saxena',
    room: 'Lab Complex 2, Lab 5',
    category: 'Laboratory',
    attendancePercentage: 91.0,
    attendanceStatus: 'Safe',
    currentScore: 92,
    maxScore: 100,
    gradeProjected: 'A+',
    units: [
      { unitNumber: 1, title: 'DDL, DML, DCL & Complex SQL Queries', topicsCount: 8, pyqCount: 8, notesCount: 3 },
      { unitNumber: 2, title: 'PL/SQL: Triggers, Procedures & Cursors', topicsCount: 10, pyqCount: 10, notesCount: 4 }
    ]
  }
];
