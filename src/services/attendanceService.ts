import { AttendanceSummary, SubjectAttendance, TimetableSlot } from '../types';
import { mockAttendanceSummary, mockSubjectAttendanceList, mockTodayTimetable, mockWeeklyTimetable } from '../data/mock/mockAttendance';
import { simulateNetworkDelay } from './api';

export interface AttendanceSimulationResult {
  projectedAttended: number;
  projectedTotal: number;
  projectedPercentage: number;
  isSafe: boolean;
  statusChange: 'Improved' | 'Declined' | 'Unchanged';
  classesNeededFor75: number;
  summaryMessage: string;
}

export const attendanceService = {
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    await simulateNetworkDelay(180);
    return { ...mockAttendanceSummary };
  },

  async getSubjectAttendance(): Promise<SubjectAttendance[]> {
    await simulateNetworkDelay(200);
    return [...mockSubjectAttendanceList];
  },

  async getTodayTimetable(): Promise<TimetableSlot[]> {
    await simulateNetworkDelay(150);
    return [...mockTodayTimetable];
  },

  async getWeeklyTimetable(): Promise<{ [key: string]: TimetableSlot[] }> {
    await simulateNetworkDelay(220);
    return { ...mockWeeklyTimetable };
  },

  /**
   * Frontend attendance simulation logic
   * Designed to mirror future FastAPI calculation endpoint: POST /api/v1/attendance/simulate
   */
  async calculateSimulation(
    currentAttended: number,
    currentTotal: number,
    upcomingClasses: number,
    plannedToAttend: number
  ): Promise<AttendanceSimulationResult> {
    await simulateNetworkDelay(120);

    const projectedAttended = Math.max(0, currentAttended + plannedToAttend);
    const projectedTotal = Math.max(1, currentTotal + upcomingClasses);
    const projectedPercentage = Number(((projectedAttended / projectedTotal) * 100).toFixed(1));
    const currentPercentage = Number(((currentAttended / currentTotal) * 100).toFixed(1));

    const isSafe = projectedPercentage >= 75.0;

    let statusChange: 'Improved' | 'Declined' | 'Unchanged' = 'Unchanged';
    if (projectedPercentage > currentPercentage) statusChange = 'Improved';
    else if (projectedPercentage < currentPercentage) statusChange = 'Declined';

    // Formula for required consecutive classes to reach 75%
    // (A + x) / (T + x) >= 0.75 => x >= (0.75*T - A) / 0.25
    let classesNeededFor75 = 0;
    if (projectedPercentage < 75.0) {
      classesNeededFor75 = Math.max(0, Math.ceil((0.75 * projectedTotal - projectedAttended) / 0.25));
    }

    let summaryMessage = `Current: ${currentPercentage}%. If you attend ${plannedToAttend} of the next ${upcomingClasses} classes: ${projectedPercentage}%.`;
    if (isSafe) {
      summaryMessage += ' You will maintain safe eligibility for university examinations.';
    } else {
      summaryMessage += ` You will need to attend at least ${classesNeededFor75} further consecutive classes without absence to reach 75%.`;
    }

    return {
      projectedAttended,
      projectedTotal,
      projectedPercentage,
      isSafe,
      statusChange,
      classesNeededFor75,
      summaryMessage,
    };
  }
};
