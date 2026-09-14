import { FacultyClassOverview, StudentAttentionItem } from '../../types';

export const mockFacultyClasses: FacultyClassOverview[] = [
  {
    id: 'fc-1',
    subjectName: 'Database Management Systems',
    subjectCode: 'KCS-601',
    section: 'CSE-3B',
    semester: 'Semester VI',
    totalStudents: 68,
    averageAttendance: 81.4,
    pendingEvaluations: 14,
    nextClassTime: 'Today, 09:00 AM',
    room: 'AB-1, Room 304'
  },
  {
    id: 'fc-2',
    subjectName: 'Database Management Systems Lab',
    subjectCode: 'KCS-651',
    section: 'CSE-3B (Batch 1)',
    semester: 'Semester VI',
    totalStudents: 34,
    averageAttendance: 94.2,
    pendingEvaluations: 4,
    nextClassTime: 'Today, 01:45 PM',
    room: 'Lab Complex 2, Lab 5'
  },
  {
    id: 'fc-3',
    subjectName: 'Advanced Database Systems (M.Tech)',
    subjectCode: 'MCS-201',
    section: 'M.Tech CSE',
    semester: 'Semester II',
    totalStudents: 18,
    averageAttendance: 89.0,
    pendingEvaluations: 2,
    nextClassTime: 'Tomorrow, 11:00 AM',
    room: 'AB-3, PG Room 12'
  }
];

export const mockStudentsRequiringAttention: StudentAttentionItem[] = [
  {
    id: 'att-1',
    studentName: 'Yashvardhan Sharma',
    rollNo: '2101920100142',
    attendance: 73.0,
    performance: 'Above Average (84%)',
    status: 'Critical Attendance',
    lastActive: 'Today, 08:30 AM'
  },
  {
    id: 'att-2',
    studentName: 'Rohan Deshmukh',
    rollNo: '2101920100118',
    attendance: 68.5,
    performance: 'Borderline (62%)',
    status: 'Critical Attendance',
    lastActive: 'Yesterday'
  },
  {
    id: 'att-3',
    studentName: 'Ananya Singhal',
    rollNo: '2101920100024',
    attendance: 82.0,
    performance: 'Dip in Sessional 2 (-14%)',
    status: 'Low Quiz Scores',
    lastActive: '2 days ago'
  },
  {
    id: 'att-4',
    studentName: 'Kartik Mishra',
    rollNo: '2101920100078',
    attendance: 74.2,
    performance: 'Pending Lab reports',
    status: 'Missing 3 Assignments',
    lastActive: '3 days ago'
  }
];

export const mockFacultyStats = {
  activeLecturesDelivered: 48,
  totalStudentsTaught: 120,
  assignmentsGradedCount: 106,
  averageSectionPassRate: 94.8,
  courseCompletionRate: 68.0
};
