import { AttendanceSummary, SubjectAttendance, TimetableSlot } from '../types';
import { apiClient } from './api';

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
  /**
   * Retrieves overall attendance metrics calculated by the backend.
   */
  async getAttendanceSummary(): Promise<AttendanceSummary> {
    return await apiClient<AttendanceSummary>('/attendance/summary');
  },

  /**
   * Retrieves per-subject attendance registry and attendance history.
   */
  async getSubjectAttendance(): Promise<SubjectAttendance[]> {
    return await apiClient<SubjectAttendance[]>('/attendance/subjects');
  },

  /**
   * Retrieves today's classes for the attendance dashboard.
   */
  async getTodayTimetable(): Promise<TimetableSlot[]> {
    return await apiClient<TimetableSlot[]>('/timetable/today');
  },

  /**
   * Retrieves weekly timetable formatted as a day-keyed dictionary.
   */
  async getWeeklyTimetable(): Promise<{ [key: string]: TimetableSlot[] }> {
    const schedules = await apiClient<{ day: string; slots: TimetableSlot[] }[]>('/timetable/weekly');
    const dayMap: { [key: string]: TimetableSlot[] } = {};
    for (const item of schedules) {
      dayMap[item.day] = item.slots;
    }
    return dayMap;
  },

  /**
   * Executes attendance what-if simulation calculation via POST /api/v1/attendance/simulate
   */
  async calculateSimulation(
    currentAttended: number,
    currentTotal: number,
    upcomingClasses: number,
    plannedToAttend: number
  ): Promise<AttendanceSimulationResult> {
    return await apiClient<AttendanceSimulationResult>('/attendance/simulate', {
      method: 'POST',
      body: JSON.stringify({
        currentAttended,
        currentTotal,
        upcomingClasses,
        plannedToAttend,
      }),
    });
  }
};
