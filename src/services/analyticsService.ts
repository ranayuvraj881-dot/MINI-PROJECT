import { AdminInstitutionalStats, FacultyClassOverview, StudentAttentionItem } from '../types';
import { mockAdminStats, mockDepartmentMetrics } from '../data/mock/mockAdmin';
import { mockFacultyClasses, mockFacultyStats, mockStudentsRequiringAttention } from '../data/mock/mockFaculty';
import { simulateNetworkDelay } from './api';

export const analyticsService = {
  async getFacultyOverview(): Promise<{
    classes: FacultyClassOverview[];
    stats: typeof mockFacultyStats;
    attentionStudents: StudentAttentionItem[];
  }> {
    await simulateNetworkDelay(200);
    return {
      classes: [...mockFacultyClasses],
      stats: { ...mockFacultyStats },
      attentionStudents: [...mockStudentsRequiringAttention]
    };
  },

  async getAdminInstitutionalData(): Promise<{
    stats: AdminInstitutionalStats;
    departments: typeof mockDepartmentMetrics;
  }> {
    await simulateNetworkDelay(240);
    return {
      stats: { ...mockAdminStats },
      departments: [...mockDepartmentMetrics]
    };
  }
};
