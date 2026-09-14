import { AssignmentItem } from '../types';
import { mockAssignmentsList } from '../data/mock/mockAssignments';
import { simulateNetworkDelay } from './api';

let localAssignments = [...mockAssignmentsList];

export const assignmentService = {
  async getAssignments(statusFilter?: string): Promise<AssignmentItem[]> {
    await simulateNetworkDelay(160);
    if (!statusFilter || statusFilter === 'All') {
      return [...localAssignments];
    }
    return localAssignments.filter(
      (a) => a.status.toLowerCase() === statusFilter.toLowerCase()
    );
  },

  async submitAssignment(id: string, fileName?: string): Promise<AssignmentItem> {
    await simulateNetworkDelay(250);
    const index = localAssignments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Assignment not found');

    const updated: AssignmentItem = {
      ...localAssignments[index],
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      fileAttachment: fileName || 'Submitted_Report_GLBITM.pdf'
    };

    localAssignments[index] = updated;
    return updated;
  }
};
