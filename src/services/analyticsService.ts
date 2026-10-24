import { AdminInstitutionalStats, FacultyClassOverview, StudentAttentionItem } from '../types';
import { apiClient } from './api';

export const analyticsService = {
  /**
   * Retrieves faculty portal class stats, attendance, and student attention radar.
   */
  async getFacultyOverview(): Promise<{
    classes: FacultyClassOverview[];
    stats: {
      totalStudentsTaught: number;
      activeBatches: number;
      averageClassAttendance: number;
      evaluationsDue: number;
    };
    attentionStudents: StudentAttentionItem[];
  }> {
    return await apiClient<{
      classes: FacultyClassOverview[];
      stats: {
        totalStudentsTaught: number;
        activeBatches: number;
        averageClassAttendance: number;
        evaluationsDue: number;
      };
      attentionStudents: StudentAttentionItem[];
    }>('/analytics/faculty');
  },

  /**
   * Retrieves administrative institutional rollups and department metrics.
   */
  async getAdminInstitutionalData(): Promise<{
    stats: AdminInstitutionalStats;
    departments: {
      code: string;
      name: string;
      students: number;
      faculty: number;
      attendanceAvg: number;
      academicHealth: string;
    }[];
  }> {
    return await apiClient<{
      stats: AdminInstitutionalStats;
      departments: {
        code: string;
        name: string;
        students: number;
        faculty: number;
        attendanceAvg: number;
        academicHealth: string;
      }[];
    }>('/analytics/admin');
  }
};
