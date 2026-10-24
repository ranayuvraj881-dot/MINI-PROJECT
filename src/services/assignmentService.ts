import { AssignmentItem } from '../types';
import { apiClient } from './api';

export const assignmentService = {
  /**
   * Retrieves assignments with optional status filtering from the backend.
   */
  async getAssignments(statusFilter?: string): Promise<AssignmentItem[]> {
    const query = statusFilter && statusFilter !== 'All' ? `?status_filter=${encodeURIComponent(statusFilter)}` : '';
    return await apiClient<AssignmentItem[]>(`/assignments${query}`);
  },

  /**
   * Submits an assignment report and returns the updated assignments list.
   */
  async submitAssignment(id: string, fileName?: string): Promise<AssignmentItem[]> {
    await apiClient<AssignmentItem>(`/assignments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ fileName: fileName || 'Submitted_Report_GLBITM.pdf' }),
    });
    // Return full updated list to keep UI synchronized
    return await this.getAssignments();
  }
};
