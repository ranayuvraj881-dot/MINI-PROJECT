import { StudyResource } from '../../types';

export const mockStudyResourcesList: StudyResource[] = [
  {
    id: 'res-01',
    title: 'Unit 3: Relational Database Design, Normal Forms (1NF to BCNF, 4NF)',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    unit: 'Unit 3',
    topic: 'Normalization & Functional Dependencies',
    type: 'PDF',
    fileSize: '4.2 MB',
    uploadedDate: '2026-02-28',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    summary: 'Comprehensive hand-written and typed classroom lecture notes covering Armstrong axioms, canonical cover derivation, 2NF, 3NF, BCNF decomposition algorithms, and lossy vs lossless join tests.'
  },
  {
    id: 'res-02',
    title: 'Unit 4: Transaction Processing, ACID Properties & Concurrency Control Protocols',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    unit: 'Unit 4',
    topic: 'Transactions & Lock Protocols',
    type: 'PPT',
    fileSize: '7.8 MB',
    uploadedDate: '2026-03-04',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    summary: 'Slide deck highlighting serializability graphs, conflict vs view serializability, strict two-phase locking (2PL), Thomas write rule, and timestamp ordering.'
  },
  {
    id: 'res-03',
    title: 'Unit 3: Deadlock Characterization, Banker’s Algorithm & Resource Allocation Graph',
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    unit: 'Unit 3',
    topic: 'Deadlocks',
    type: 'PDF',
    fileSize: '3.1 MB',
    uploadedDate: '2026-03-02',
    facultyName: 'Prof. Meenakshi Sundaram',
    summary: 'Deep-dive lecture handout with worked numerical examples on safety algorithm, request resource algorithm, and deadlock detection in distributed vs centralized OS.'
  },
  {
    id: 'res-04',
    title: 'Unit 2: LR(0), SLR(1), CLR(1) and LALR(1) Parsing Table Construction',
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    unit: 'Unit 2',
    topic: 'Bottom-Up Parsing',
    type: 'DOC',
    fileSize: '1.9 MB',
    uploadedDate: '2026-02-24',
    facultyName: 'Dr. Arvind Kumar Pandey',
    summary: 'Detailed comparative document with 15 solved grammar derivations, lookahead propagation, and handling shift-reduce vs reduce-reduce conflicts.'
  },
  {
    id: 'res-05',
    title: 'Unit 2: Support Vector Machines & Kernel Tricks Video Lecture Archive',
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    unit: 'Unit 2',
    topic: 'Support Vector Machines',
    type: 'VIDEO',
    fileSize: '45 mins stream',
    uploadedDate: '2026-03-01',
    facultyName: 'Dr. Priyanka Rastogi',
    summary: 'Classroom recording explaining maximal margin hyperplane formulation, Lagrange multipliers, soft margin slack variables, and Gaussian RBF kernels.'
  },
  {
    id: 'res-06',
    title: 'FastAPI Production Architecture & Docker Setup Guide',
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology & Cloud Applications',
    unit: 'Unit 5',
    topic: 'Microservices & Deployment',
    type: 'LINK',
    fileSize: 'Web Documentation',
    uploadedDate: '2026-03-06',
    facultyName: 'Prof. Ankit Verma',
    summary: 'Curated university GitHub repository containing containerized production-ready backend starter code with PostgreSQL connection pooling.'
  },
  {
    id: 'res-07',
    title: 'Unit 5: B+ Trees, Indexed Sequential Access Method (ISAM) & Hashing',
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    unit: 'Unit 5',
    topic: 'Indexing & Physical Storage',
    type: 'PDF',
    fileSize: '5.6 MB',
    uploadedDate: '2026-03-08',
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    summary: 'Detailed step-by-step illustrations of dynamic index insertions, node splitting, balance factors, and bucket overflow chains in extensible hashing.'
  }
];
