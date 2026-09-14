import { SubjectMarks } from '../../types';

export const mockSubjectMarksList: SubjectMarks[] = [
  {
    subjectCode: 'KCS-601',
    subjectName: 'Database Management Systems',
    credits: 4,
    facultyName: 'Dr. Sanjeev Kumar Sharma',
    internalSessional1: { scored: 24, max: 30 },
    internalSessional2: { scored: 26, max: 30 },
    quizzes: { scored: 18, max: 20 },
    assignments: { scored: 16, max: 20 },
    practicals: { scored: 46, max: 50 },
    currentTotalPercentage: 84.0,
    gradeProjected: 'A',
    trend: 'up',
    changePercentage: 12.0
  },
  {
    subjectCode: 'KCS-602',
    subjectName: 'Operating Systems',
    credits: 4,
    facultyName: 'Prof. Meenakshi Sundaram',
    internalSessional1: { scored: 27, max: 30 },
    internalSessional2: { scored: 28, max: 30 },
    quizzes: { scored: 19, max: 20 },
    assignments: { scored: 19, max: 20 },
    practicals: { scored: 48, max: 50 },
    currentTotalPercentage: 92.5,
    gradeProjected: 'A+',
    trend: 'up',
    changePercentage: 4.5
  },
  {
    subjectCode: 'KCS-603',
    subjectName: 'Compiler Design',
    credits: 4,
    facultyName: 'Dr. Arvind Kumar Pandey',
    internalSessional1: { scored: 22, max: 30 },
    internalSessional2: { scored: 23, max: 30 },
    quizzes: { scored: 15, max: 20 },
    assignments: { scored: 16, max: 20 },
    practicals: { scored: 44, max: 50 },
    currentTotalPercentage: 76.5,
    gradeProjected: 'B+',
    trend: 'down',
    changePercentage: -3.0
  },
  {
    subjectCode: 'KOE-064',
    subjectName: 'Machine Learning Techniques',
    credits: 3,
    facultyName: 'Dr. Priyanka Rastogi',
    internalSessional1: { scored: 25, max: 30 },
    internalSessional2: { scored: 26, max: 30 },
    quizzes: { scored: 18, max: 20 },
    assignments: { scored: 17, max: 20 },
    currentTotalPercentage: 86.0,
    gradeProjected: 'A',
    trend: 'up',
    changePercentage: 6.0
  },
  {
    subjectCode: 'KIT-601',
    subjectName: 'Web Technology & Cloud Applications',
    credits: 3,
    facultyName: 'Prof. Ankit Verma',
    internalSessional1: { scored: 28, max: 30 },
    internalSessional2: { scored: 29, max: 30 },
    quizzes: { scored: 19, max: 20 },
    assignments: { scored: 20, max: 20 },
    practicals: { scored: 49, max: 50 },
    currentTotalPercentage: 94.0,
    gradeProjected: 'A+',
    trend: 'up',
    changePercentage: 8.0
  }
];

export const mockSemesterTrend = [
  { semester: 'Sem I', sgpa: 8.42, cgpa: 8.42 },
  { semester: 'Sem II', sgpa: 8.65, cgpa: 8.54 },
  { semester: 'Sem III', sgpa: 8.80, cgpa: 8.63 },
  { semester: 'Sem IV', sgpa: 8.75, cgpa: 8.66 },
  { semester: 'Sem V', sgpa: 8.90, cgpa: 8.72 },
  { semester: 'Sem VI (Projected)', sgpa: 8.85, cgpa: 8.74 }
];

export const mockPerformanceInsights = [
  {
    id: 'ins-1',
    type: 'positive',
    title: 'DBMS Quiz Surge',
    message: 'Your DBMS quiz performance improved by 12% compared to the previous assessment, driven by higher scores on ER relational mapping.'
  },
  {
    id: 'ins-2',
    type: 'caution',
    title: 'Compiler Design Sessional Margin',
    message: 'Sessional score in Compiler Design is 76.5%. Focus on LR parsing and SDT derivations to maintain eligibility for A grade.'
  },
  {
    id: 'ins-3',
    type: 'positive',
    title: 'Top 5% in Web Technology',
    message: 'Scored 94% aggregate in Web Tech internal evaluations, placing in the top 5th percentile of Section CSE-3B.'
  }
];
