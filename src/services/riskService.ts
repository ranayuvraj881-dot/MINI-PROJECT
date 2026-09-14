import { AcademicRiskReport } from '../types';
import { mockAcademicRiskReport } from '../data/mock/mockAI';
import { simulateNetworkDelay } from './api';

export const riskService = {
  /**
   * Predicts academic risk factors based on student metrics
   * Structured for future ML model endpoint: POST /api/v1/ml/predict-risk
   */
  async getRiskReport(): Promise<AcademicRiskReport> {
    await simulateNetworkDelay(250);
    return { ...mockAcademicRiskReport };
  },

  async recalculateRiskWithTarget(targetCgpa: number): Promise<AcademicRiskReport> {
    await simulateNetworkDelay(280);
    return {
      ...mockAcademicRiskReport,
      score: targetCgpa >= 9.0 ? 52 : 38,
      overallRisk: targetCgpa >= 9.0 ? 'MEDIUM' : 'SAFE',
      whyExplanation: `Targeting CGPA ${targetCgpa} requires converting your DBMS (73%) and Compiler Design (76.5%) to minimum A grades while fulfilling the 75% attendance threshold.`
    };
  }
};
