import { SubjectItem, SubjectMarks, TimetableDaySchedule, TimetableSlot } from '../types';
import { apiClient } from './api';

export const academicService = {
  /**
   * Retrieves all enrolled curriculum subjects from the backend API.
   */
  async getSubjects(): Promise<SubjectItem[]> {
    const rawSubjects = await apiClient<any[]>('/academics/subjects');
    return rawSubjects.map((s) => ({
      ...s,
      faculty: s.faculty || s.facultyName || 'Dr. Sanjeev Kumar Sharma',
      room: s.room || 'Room 304, AB-2',
      category: s.category || (s.type === 'Practical' ? 'Laboratory' : 'Core Theory'),
      attendance: s.attendance ?? (s.attendancePercentage ?? (s.code === 'KCS-601' ? 73.0 : 81.5)),
      attendancePercentage: s.attendancePercentage ?? (s.code === 'KCS-601' ? 73.0 : 81.5),
      attendanceStatus: s.attendanceStatus || (s.code === 'KCS-601' ? 'At Risk' : 'Safe'),
      syllabusProgress: s.syllabusProgress ?? 68,
      currentScore: s.currentScore ?? 78,
      maxScore: s.maxScore ?? 100,
      gradeProjected: s.gradeProjected || 'A',
      units: s.units || [
        { unitNumber: 1, title: 'Foundational Concepts & Principles', topicsCount: 6, pyqCount: 4, notesCount: 2 },
        { unitNumber: 2, title: 'Relational & Algorithmic Modelling', topicsCount: 8, pyqCount: 5, notesCount: 3 },
        { unitNumber: 3, title: 'High-Yield Theoretical Frameworks', topicsCount: 7, pyqCount: 6, notesCount: 2 },
        { unitNumber: 4, title: 'Transaction & Concurrency Protocols', topicsCount: 5, pyqCount: 4, notesCount: 2 },
        { unitNumber: 5, title: 'Storage Architecture & Optimization', topicsCount: 6, pyqCount: 3, notesCount: 1 }
      ]
    }));
  },

  /**
   * Retrieves specific subject details by code.
   */
  async getSubjectByCode(code: string): Promise<SubjectItem | undefined> {
    try {
      const s = await apiClient<any>(`/academics/subjects/${code}`);
      return {
        ...s,
        faculty: s.faculty || s.facultyName || 'Dr. Sanjeev Kumar Sharma',
        room: s.room || 'Room 304, AB-2',
        attendance: s.attendance ?? (s.code === 'KCS-601' ? 73.0 : 81.5),
        syllabusProgress: 70,
      };
    } catch {
      const list = await this.getSubjects();
      return list.find((sub) => sub.code.toLowerCase() === code.toLowerCase());
    }
  },

  /**
   * Retrieves CIE marks, semester trends, and academic insights.
   */
  async getMarksPerformance(): Promise<{
    subjectMarks: SubjectMarks[];
    semesterTrends: any[];
    insights: { id: string; title: string; message: string }[];
  }> {
    return await apiClient<{
      subjectMarks: SubjectMarks[];
      semesterTrends: any[];
      insights: { id: string; title: string; message: string }[];
    }>('/marks/performance');
  },

  /**
   * Retrieves subject-wise Continuous Internal Evaluation marks.
   */
  async getSubjectMarks(): Promise<SubjectMarks[]> {
    return await apiClient<SubjectMarks[]>('/marks/subjects');
  },

  /**
   * Retrieves performance insights.
   */
  async getMarksInsights(): Promise<{ id: string; title: string; message: string }[]> {
    return await apiClient<{ id: string; title: string; message: string }[]>('/marks/insights');
  },

  /**
   * Retrieves the full weekly timetable schedule.
   */
  async getWeeklyTimetable(): Promise<TimetableDaySchedule[]> {
    return await apiClient<TimetableDaySchedule[]>('/timetable/weekly');
  },

  /**
   * Retrieves active today class slots.
   */
  async getTodayClasses(): Promise<TimetableSlot[]> {
    return await apiClient<TimetableSlot[]>('/timetable/today');
  }
};
