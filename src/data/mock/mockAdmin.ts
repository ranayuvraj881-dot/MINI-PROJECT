import { AdminInstitutionalStats } from '../../types';

export const mockAdminStats: AdminInstitutionalStats = {
  totalStudents: 8420,
  totalFaculty: 480,
  departments: 9,
  activeCourses: 32,
  averageCampusAttendance: 82.6,
  academicAverageCgpa: 8.14,
  assignmentCompletionRate: 89.2,
  insights: [
    {
      id: 'ai-ins-1',
      title: '2nd-Year CSE Attendance Variance',
      description: 'Attendance has declined by 4.2% in 2nd-year CSE over the past 3 weeks following festive holidays. Department HOD advisory recommended.',
      trend: 'warning',
      department: 'Computer Science & Engineering'
    },
    {
      id: 'ai-ins-2',
      title: 'High Assignment Submission Velocity',
      description: 'Information Technology & AI/ML branches achieved 96.4% on-time submission rate for Lab Sessional assignments.',
      trend: 'positive',
      department: 'Information Technology'
    },
    {
      id: 'ai-ins-3',
      title: 'AKTU PYQ Correlation Signal',
      description: 'Students engaging with AI PYQ Analyzer scored on average 14% higher on internal sessional examinations in Operating Systems and DBMS.',
      trend: 'positive',
      department: 'All Engineering Departments'
    },
    {
      id: 'ai-ins-4',
      title: 'Classroom Utilization Peak',
      description: 'Academic Block 1 lecture halls reached 94% occupancy between 09:00 AM and 01:00 PM. Balanced slot reallocation suggested for 4th year electives.',
      trend: 'neutral',
      department: 'Academic Operations'
    }
  ]
};

export const mockDepartmentMetrics = [
  { name: 'Computer Science & Engg (CSE)', students: 2450, attendance: 81.2, avgCgpa: 8.42, riskRate: 4.1 },
  { name: 'Information Technology (IT)', students: 1200, attendance: 84.5, avgCgpa: 8.28, riskRate: 3.2 },
  { name: 'CSE (Artificial Intelligence & ML)', students: 980, attendance: 85.0, avgCgpa: 8.51, riskRate: 2.8 },
  { name: 'Electronics & Communication (ECE)', students: 1150, attendance: 79.8, avgCgpa: 7.95, riskRate: 6.4 },
  { name: 'Mechanical Engineering (ME)', students: 640, attendance: 82.0, avgCgpa: 7.82, riskRate: 5.5 },
  { name: 'Electrical & Electronics (EEE)', students: 580, attendance: 80.4, avgCgpa: 7.88, riskRate: 6.0 },
  { name: 'Civil Engineering (CE)', students: 420, attendance: 83.1, avgCgpa: 7.76, riskRate: 5.1 },
  { name: 'Management Studies (MBA)', students: 520, attendance: 87.2, avgCgpa: 8.35, riskRate: 2.1 },
  { name: 'Computer Applications (MCA)', students: 480, attendance: 83.9, avgCgpa: 8.12, riskRate: 3.5 }
];
