import { apiClient } from './api';

export interface FacultyStudentItem {
  id: string;
  name: string;
  rollNumber: string;
  enrollmentNo: string;
  collegeId: string;
  email: string;
  phone?: string;
  department: string;
  course: string;
  branch: string;
  semester: string;
  section: string;
  cgpa: number;
  attendancePercentage: number;
  attendanceStatus: 'Safe' | 'At Risk' | 'Critical';
  cieAverage: number;
  totalClasses: number;
  attendedClasses: number;
  avatarUrl?: string;
}

export interface CreateStudentPayload {
  name: string;
  rollNumber: string;
  enrollmentNo?: string;
  collegeId?: string;
  email: string;
  phone?: string;
  department?: string;
  course?: string;
  branch?: string;
  semester?: string;
  section?: string;
  cgpa?: number;
}

export interface UpdateStudentPayload {
  name?: string;
  rollNumber?: string;
  email?: string;
  phone?: string;
  branch?: string;
  section?: string;
  semester?: string;
  cgpa?: number;
}

export interface MarkAttendancePayload {
  subjectCode: string;
  section?: string;
  date: string;
  records: { studentId: string; status: 'Present' | 'Absent' | 'Late' }[];
}

export interface RecordMarksPayload {
  studentId?: string;
  rollNumber?: string;
  subjectCode: string;
  sessional1?: number;
  sessional2?: number;
  quizzes?: number;
  assignments?: number;
  practicals?: number;
}

export interface BulkRecordMarksPayload {
  subjectCode: string;
  records: RecordMarksPayload[];
}

export interface StudentStrengthDiagnosisItem {
  studentId: string;
  name: string;
  rollNumber: string;
  enrollmentNo?: string;
  email?: string;
  section: string;
  semester: string;
  branch?: string;
  subjectCode: string;
  subjectName: string;
  sessional1?: number;
  sessional1Max: number;
  sessional2?: number;
  sessional2Max: number;
  quizzes?: number;
  quizzesMax: number;
  assignments?: number;
  assignmentsMax: number;
  practicals?: number;
  practicalsMax: number;
  totalScored: number;
  totalMax: number;
  totalPercentage: number;
  gradeProjected: string;
  strengthStatus: 'STRONG' | 'MODERATE' | 'WEAK';
  strongComponents: string[];
  weakComponents: string[];
  recommendation: string;
}

export interface ClassMarksAnalyticsResponse {
  subjectCode: string;
  subjectName: string;
  section?: string;
  semester?: string;
  totalEnrolled: number;
  evaluatedCount: number;
  strongCount: number;
  moderateCount: number;
  weakCount: number;
  strongPercentage: number;
  moderatePercentage: number;
  weakPercentage: number;
  averageSessional1: number;
  averageSessional2: number;
  averageQuizzes: number;
  averageAssignments: number;
  averagePracticals: number;
  classAveragePercentage: number;
  overallHealth: string;
  students: StudentStrengthDiagnosisItem[];
}

export interface AtRiskStudentDiagnosis {
  rollNumber: string;
  name: string;
  section: string;
  totalPercentage: number;
  weakAreas: string[];
  suggestedAction: string;
}

export interface MarksAiDiagnosisResponse {
  subjectCode: string;
  subjectName: string;
  executiveSummary: string;
  classStrengths: string[];
  criticalWeaknesses: string[];
  atRiskStudents: AtRiskStudentDiagnosis[];
  remedialActionPlan: string[];
  examReadinessForecast: string;
}


export interface CreateAssignmentPayload {
  title: string;
  subjectCode: string;
  dueDate: string;
  maxMarks: number;
  description?: string;
  section?: string;
}

export interface UploadResourcePayload {
  title: string;
  subjectCode: string;
  unitNumber: number;
  topic: string;
  resourceType?: string;
  description?: string;
  downloadUrl?: string;
}

export interface SendAlertPayload {
  studentId: string;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'urgent';
}

export interface FacultyDashboardStats {
  totalStudents: number;
  averageAttendance: number;
  studentsAtRisk: number;
  pendingSubmissionsToGrade: number;
  activeClasses: number;
}

export const facultyService = {
  /**
   * Fetch full roster of enrolled students with live metrics from the database with semester and branch filtering.
   */
  async getStudents(section?: string, search?: string, semester?: string, branch?: string): Promise<FacultyStudentItem[]> {
    const params = new URLSearchParams();
    if (section && section !== 'All') params.append('section', section);
    if (search) params.append('search', search);
    if (semester && semester !== 'All') params.append('semester', semester);
    if (branch && branch !== 'All') params.append('branch', branch);

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<FacultyStudentItem[]>(`/faculty/students${qs}`);
  },

  /**
   * Teacher creates and stores a new student record in the database.
   */
  async createStudent(payload: CreateStudentPayload): Promise<FacultyStudentItem> {
    return await apiClient<FacultyStudentItem>('/faculty/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher updates existing student information in the database.
   */
  async updateStudent(studentId: string, payload: UpdateStudentPayload): Promise<FacultyStudentItem> {
    return await apiClient<FacultyStudentItem>(`/faculty/students/${studentId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher removes a student record from the database.
   */
  async deleteStudent(studentId: string): Promise<{ success: boolean; message: string }> {
    return await apiClient<{ success: boolean; message: string }>(`/faculty/students/${studentId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Teacher submits class attendance for recording in database and attendance history logs.
   */
  async markAttendance(payload: MarkAttendancePayload): Promise<{
    success: boolean;
    message: string;
    presentCount: number;
    absentCount: number;
  }> {
    return await apiClient<any>('/faculty/attendance', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher inputs and records Continuous Internal Assessment marks in the database using rollNumber or studentId.
   */
  async recordMarks(payload: RecordMarksPayload): Promise<{
    success: boolean;
    message: string;
    studentId: string;
    rollNumber: string;
    studentName: string;
    subjectCode: string;
    totalPercentage: number;
    gradeProjected: string;
    strengthStatus: 'STRONG' | 'MODERATE' | 'WEAK';
    strongComponents: string[];
    weakComponents: string[];
    recommendation: string;
  }> {
    return await apiClient<any>('/faculty/marks', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher uploads batch/CSV marks entries by roll number in one operation.
   */
  async recordBulkMarks(payload: BulkRecordMarksPayload): Promise<{
    success: boolean;
    message: string;
    updatedCount: number;
    notFoundRolls: string[];
    results: any[];
  }> {
    return await apiClient<any>('/faculty/marks/bulk', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetch full class marksheet and academic strength diagnostics for all enrolled students.
   */
  async getClassMarksAnalytics(subjectCode = 'KCS-601', section?: string, search?: string): Promise<ClassMarksAnalyticsResponse> {
    const params = new URLSearchParams();
    if (subjectCode) params.append('subjectCode', subjectCode);
    if (section && section !== 'All') params.append('section', section);
    if (search) params.append('search', search);

    const qs = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<ClassMarksAnalyticsResponse>(`/faculty/marks/class${qs}`);
  },

  /**
   * Generates intelligent Google Gemini pedagogical diagnosis of what is strong, weak, and recommended actions.
   */
  async getMarksAiDiagnostic(subjectCode = 'KCS-601', section?: string): Promise<MarksAiDiagnosisResponse> {
    return await apiClient<MarksAiDiagnosisResponse>('/faculty/marks/ai-diagnostic', {
      method: 'POST',
      body: JSON.stringify({
        subjectCode,
        section: section && section !== 'All' ? section : undefined,
      }),
    });
  },


  /**
   * Teacher publishes a new assignment to the database and dispatches notifications.
   */
  async createAssignment(payload: CreateAssignmentPayload): Promise<{
    success: boolean;
    message: string;
    assignmentId: string;
  }> {
    return await apiClient<any>('/faculty/assignments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher uploads and stores a lecture note/resource in the student portal database.
   */
  async uploadResource(payload: UploadResourcePayload): Promise<{
    success: boolean;
    message: string;
    resourceId: string;
  }> {
    return await apiClient<any>('/faculty/resources', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher sends an academic counseling alert stored directly in student notifications.
   */
  async sendStudentAlert(payload: SendAlertPayload): Promise<{
    success: boolean;
    message: string;
  }> {
    return await apiClient<any>('/faculty/alert', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Aggregated real-time faculty console statistics calculated from database records.
   */
  async getStats(): Promise<FacultyDashboardStats> {
    return await apiClient<FacultyDashboardStats>('/faculty/stats');
  },
};
