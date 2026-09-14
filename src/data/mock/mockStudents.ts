import { UserProfile } from '../../types';

export const mockCurrentStudent: UserProfile = {
  id: 'glb-stu-210192',
  name: 'Yashvardhan Sharma',
  enrollmentNo: '2101920100142',
  collegeId: 'GLB21CS0892',
  email: 'yashvardhan.sharma.cse@glbitm.ac.in',
  phone: '+91 98765 43210',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  department: 'Computer Science & Engineering',
  course: 'B.Tech',
  branch: 'CSE',
  semester: 'Semester VI',
  section: 'CSE-3B',
  batch: '2022 - 2026',
  mentorName: 'Dr. Sanjeev Kumar Sharma (Associate Professor)',
  bloodGroup: 'B+',
  cgpa: 8.72,
  totalCredits: 124,
  achievements: [
    {
      title: '1st Runner Up - Smart India Hackathon (Internal)',
      date: 'Dec 2025',
      category: 'Hackathon',
      organization: 'GL Bajaj Innovation & Incubation Centre'
    },
    {
      title: 'Dean’s Academic Merit List (Sem IV)',
      date: 'July 2025',
      category: 'Academic',
      organization: 'GL Bajaj Institute of Tech & Mgmt'
    },
    {
      title: 'Published Research Paper on Distributed Databases',
      date: 'Nov 2025',
      category: 'Research',
      organization: 'IEEE Student Branch GLBITM'
    }
  ]
};

export const mockFacultyUser: UserProfile = {
  id: 'glb-fac-0042',
  name: 'Dr. Sanjeev Kumar Sharma',
  enrollmentNo: 'EMP-CSE-042',
  collegeId: 'FAC042CS',
  email: 'sanjeev.sharma@glbitm.ac.in',
  phone: '+91 98112 34567',
  role: 'faculty',
  department: 'Computer Science & Engineering',
  course: 'B.Tech',
  branch: 'CSE',
  semester: 'Faculty Portal',
  section: 'CSE Senior Faculty',
  batch: 'Academic Year 2025-26',
  cgpa: undefined
};

export const mockAdminUser: UserProfile = {
  id: 'glb-adm-0001',
  name: 'Prof. (Dr.) Manas Kumar Mishra',
  enrollmentNo: 'DIR-GLB-001',
  collegeId: 'ADM001',
  email: 'director.office@glbitm.ac.in',
  phone: '+91 120 2323818',
  role: 'admin',
  department: 'Office of Academic Affairs & Administration',
  course: 'Institutional Administration',
  branch: 'GL Bajaj Institute of Technology & Management',
  semester: 'CampusOS SuperAdmin',
  section: 'Greater Noida Campus',
  batch: '2026'
};
