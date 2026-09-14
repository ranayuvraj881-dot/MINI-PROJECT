import { PYQItem, TopicAnalysis } from '../../types';

export const mockPYQList: PYQItem[] = [
  {
    id: 'pyq-01',
    question: 'Define Normalization. Explain 1NF, 2NF, 3NF and BCNF with suitable examples. State the conditions under which a 3NF relation is guaranteed to be in BCNF.',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 3',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 8,
    topic: 'Normalization & Functional Dependencies',
    marksWeightage: 10
  },
  {
    id: 'pyq-02',
    question: 'What is Conflict Serializability? How does precedence (serialization) graph algorithm test whether a schedule is conflict serializable? Explain with a schedule containing 3 transactions.',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    semester: 'Semester VI',
    year: 2023,
    unit: 'Unit 4',
    examType: 'End-Sem',
    difficulty: 'Hard',
    frequency: 6,
    topic: 'Transactions & Concurrency Control',
    marksWeightage: 10
  },
  {
    id: 'pyq-03',
    question: 'Construct a B+ tree of order 4 for the following sequence of key values: 10, 20, 30, 40, 50, 60, 70, 80, 90. Show the step-by-step splitting of leaf and non-leaf nodes.',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 5',
    examType: 'Pre-University Test',
    difficulty: 'Hard',
    frequency: 5,
    topic: 'B+ Trees & Indexing',
    marksWeightage: 10
  },
  {
    id: 'pyq-04',
    question: 'State the four necessary conditions for Deadlock occurrence. Explain Banker’s Algorithm for deadlock avoidance with safety and resource request algorithms.',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 3',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 7,
    topic: 'Deadlocks',
    marksWeightage: 10
  },
  {
    id: 'pyq-05',
    question: 'Compare Paging and Segmentation memory management schemes. Calculate effective memory access time for a 2-level paging scheme with TLB hit ratio 90% and TLB access time 20ns.',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    semester: 'Semester VI',
    year: 2023,
    unit: 'Unit 4',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 6,
    topic: 'Virtual Memory & Paging',
    marksWeightage: 10
  },
  {
    id: 'pyq-06',
    question: 'Construct the Canonical LR (CLR) parsing table for the grammar: S -> CC, C -> cC | d. Identify whether any shift/reduce or reduce/reduce conflict occurs.',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 2',
    examType: 'End-Sem',
    difficulty: 'Hard',
    frequency: 6,
    topic: 'Bottom-Up Parsing (CLR/LALR)',
    marksWeightage: 10
  },
  {
    id: 'pyq-07',
    question: 'Differentiate between Synthesized and Inherited attributes in Syntax Directed Definition (SDD). Give an SDD for desktop desk-calculator evaluating arithmetic expressions.',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    semester: 'Semester VI',
    year: 2023,
    unit: 'Unit 3',
    examType: 'Mid-Sem',
    difficulty: 'Medium',
    frequency: 5,
    topic: 'Syntax Directed Translation',
    marksWeightage: 7
  },
  {
    id: 'pyq-08',
    question: 'Explain the working of Support Vector Machine (SVM) for linearly non-separable datasets. How do Kernel functions transform data to higher dimensional feature space?',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 2',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 6,
    topic: 'Support Vector Machines',
    marksWeightage: 10
  },
  {
    id: 'pyq-09',
    question: 'What is Overfitting in Machine Learning? Discuss the Bias-Variance tradeoff and describe L1 (Lasso) and L2 (Ridge) regularization mechanisms.',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    semester: 'Semester VI',
    year: 2023,
    unit: 'Unit 5',
    examType: 'Mid-Sem',
    difficulty: 'Easy',
    frequency: 5,
    topic: 'Model Evaluation & Regularization',
    marksWeightage: 7
  },
  {
    id: 'pyq-10',
    question: 'Describe the complete lifecycle of an asynchronous HTTP request using Fetch API and Promises. How does the JavaScript Event Loop manage Microtasks and Macrotasks?',
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology & Cloud Applications',
    semester: 'Semester VI',
    year: 2024,
    unit: 'Unit 2',
    examType: 'End-Sem',
    difficulty: 'Medium',
    frequency: 5,
    topic: 'Asynchronous JavaScript & Event Loop',
    marksWeightage: 10
  }
];

export const mockTopicAnalyses: TopicAnalysis[] = [
  {
    topic: 'Normalization & Functional Dependencies',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    frequency: 8,
    importance: 'HIGH IMPORTANCE',
    unit: 'Unit 3',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'Transactions & Concurrency Control (2PL, Serializability)',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    frequency: 6,
    importance: 'HIGH IMPORTANCE',
    unit: 'Unit 4',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'Deadlock Avoidance & Banker’s Algorithm',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    frequency: 7,
    importance: 'HIGH IMPORTANCE',
    unit: 'Unit 3',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'LR/LALR Parsing Table Construction',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    frequency: 6,
    importance: 'HIGH IMPORTANCE',
    unit: 'Unit 2',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'Relational Algebra & SQL Nested Queries',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    frequency: 5,
    importance: 'MEDIUM/HIGH',
    unit: 'Unit 2',
    averageMarks: 7,
    lastAskedYear: 2023
  },
  {
    topic: 'B+ Tree Order & Split Derivation',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    frequency: 5,
    importance: 'MEDIUM/HIGH',
    unit: 'Unit 5',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'Support Vector Machines & Kernel Formulation',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    frequency: 6,
    importance: 'HIGH IMPORTANCE',
    unit: 'Unit 2',
    averageMarks: 10,
    lastAskedYear: 2024
  },
  {
    topic: 'CPU Scheduling Algorithms (SJF, Round Robin)',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    frequency: 5,
    importance: 'MEDIUM/HIGH',
    unit: 'Unit 2',
    averageMarks: 7,
    lastAskedYear: 2024
  },
  {
    topic: 'Code Optimization: Basic Blocks & DAG',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    frequency: 4,
    importance: 'MODERATE',
    unit: 'Unit 5',
    averageMarks: 7,
    lastAskedYear: 2023
  }
];
