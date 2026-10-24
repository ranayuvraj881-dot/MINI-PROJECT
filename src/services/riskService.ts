import { AcademicRiskReport } from '../types';
import { apiClient } from './api';

export const riskService = {
  /**
   * Retrieves academic risk factors calculated dynamically from active records.
   */
  async getRiskReport(): Promise<AcademicRiskReport> {
    return await apiClient<AcademicRiskReport>('/analytics/risk');
  },

  /**
   * Recalculates risk factors against an ambitious target CGPA.
   */
  async recalculateRiskWithTarget(targetCgpa: number): Promise<AcademicRiskReport> {
    return await apiClient<AcademicRiskReport>('/analytics/risk/target', {
      method: 'POST',
      body: JSON.stringify({ targetCgpa }),
    });
  }
};
