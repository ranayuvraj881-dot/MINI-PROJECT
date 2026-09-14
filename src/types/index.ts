import { SubjectOverview } from '../data/mock/mockSubjects';
export type SubjectItem = SubjectOverview;

export interface TimetableDaySchedule {
  day: string;
  slots: TimetableSlot[];
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  enrollmentNo: string;
  enrollmentNumber?: string;
  rollNumber?: string;
  collegeId: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  course: string;
  branch: string;
  semester: string;
  section: string;
  batch: string;
  mentorName?: string;
  bloodGroup?: string;
  cgpa?: number;
  totalCredits?: number;
  achievements?: {
    title: string;
    date: string;
    category: string;
    organization: string;
  }[];
}

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial';

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "09:50"
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
  type: ClassType;
  attendanceStatus?: 'Present' | 'Absent' | 'Upcoming' | 'Cancelled';
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Safe' | 'At Risk' | 'Critical';
  minRequired: number; // usually 75%
  classesNeededToSafe: number;
  classesCanAffordToMiss: number;
  history: {
    date: string;
    status: 'Present' | 'Absent' | 'Late';
  }[];
}

export interface AttendanceSummary {
  overallPercentage: number;
  totalClasses: number;
  classesAttended: number;
  classesMissed: number;
  subjectsAtRiskCount: number;
  targetRequirement: number;
  insight: {
    subject: string;
    currentPercentage: number;
    classesNeeded: number;
    message: string;
  };
}

export interface SubjectMarks {
  subjectCode: string;
  subjectName: string;
  credits: number;
  facultyName: string;
  internalSessional1: { scored: number; max: number };
  internalSessional2: { scored: number; max: number };
  quizzes: { scored: number; max: number };
  assignments: { scored: number; max: number };
  practicals?: { scored: number; max: number };
  currentTotalPercentage: number;
  gradeProjected: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  sessional1?: number;
  sessional2?: number;
  quizzesScore?: number;
  assignmentScore?: number;
  labPractical?: number;
}

export interface AssignmentItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  title: string;
  description: string;
  facultyName: string;
  assignedDate: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Overdue';
  priority: 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'NORMAL';
  submittedDate?: string;
  marksObtained?: number;
  maxMarks: number;
  fileAttachment?: string;
}

export type ResourceType = 'PDF' | 'PPT' | 'DOC' | 'VIDEO' | 'LINK';

export interface StudyResource {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  unit: string;
  topic: string;
  type: ResourceType;
  fileSize?: string;
  uploadedDate: string;
  facultyName: string;
  uploadedBy?: string;
  downloadUrl?: string;
  summary?: string;
}

export interface PYQItem {
  id: string;
  question: string;
  subjectCode: string;
  subjectName: string;
  semester: string;
  year: number;
  unit: string;
  examType: 'Mid-Sem' | 'End-Sem' | 'Pre-University Test';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  frequency: number; // times asked
  topic: string;
  marksWeightage: number;
}

export interface TopicAnalysis {
  topic: string;
  subjectCode: string;
  subjectName: string;
  frequency: number;
  importance: 'HIGH IMPORTANCE' | 'MEDIUM/HIGH' | 'MODERATE';
  unit: string;
  averageMarks: number;
  lastAskedYear: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextApplied?: string;
  suggestedFollowups?: string[];
  referenceLinks?: { title: string; url?: string; type: string }[];
}

export interface StudyPlanSlot {
  id: string;
  timeSlot: string;
  subjectName: string;
  subjectCode: string;
  topic: string;
  taskType: 'Revision' | 'PYQ Practice' | 'Problem Solving' | 'Lab Exercise';
  completed: boolean;
}

export interface DayStudyPlan {
  day: string;
  date: string;
  focusArea: string;
  targetHours: number;
  slots: StudyPlanSlot[];
}

export interface AcademicRiskFactor {
  id: string;
  factor: 'Attendance' | 'Internal Marks' | 'Assignment Completion' | 'Quiz Performance';
  status: 'Safe' | 'Warning' | 'Critical';
  value: string;
  impactScore: number;
  detail: string;
}

export interface AcademicRiskReport {
  overallRisk: 'SAFE' | 'MEDIUM' | 'HIGH';
  score: number; // 0 to 100
  title: string;
  whyExplanation: string;
  factors: AcademicRiskFactor[];
  recommendedActions: {
    id: string;
    action: string;
    priority: 'Immediate' | 'Important' | 'Recommended';
    subject?: string;
  }[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'Important' | 'Academic' | 'Attendance' | 'Assignments' | 'General';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export interface FacultyClassOverview {
  id: string;
  subjectName: string;
  subjectCode: string;
  section: string;
  semester: string;
  totalStudents: number;
  averageAttendance: number;
  pendingEvaluations: number;
  nextClassTime: string;
  room: string;
}

export interface StudentAttentionItem {
  id: string;
  studentName: string;
  rollNo: string;
  attendance: number;
  performance: string;
  status: 'Critical Attendance' | 'Low Quiz Scores' | 'Missing 3 Assignments';
  lastActive: string;
}

export interface AdminInstitutionalStats {
  totalStudents: number;
  totalFaculty: number;
  departments: number;
  activeCourses: number;
  averageCampusAttendance: number;
  academicAverageCgpa: number;
  assignmentCompletionRate: number;
  insights: {
    id: string;
    title: string;
    description: string;
    trend: 'warning' | 'positive' | 'neutral';
    department: string;
  }[];
}
