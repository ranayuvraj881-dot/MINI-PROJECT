import { SubjectMarks, TimetableDaySchedule, TimetableSlot } from '../types';
import { mockPerformanceInsights, mockSemesterTrend, mockSubjectMarksList } from '../data/mock/mockMarks';
import { mockSubjects, SubjectOverview } from '../data/mock/mockSubjects';
import { mockWeeklyTimetable } from '../data/mock/mockTimetable';
import { simulateNetworkDelay } from './api';

export const academicService = {
  async getSubjects(): Promise<SubjectOverview[]> {
    await simulateNetworkDelay(160);
    return [...mockSubjects];
  },

  async getSubjectByCode(code: string): Promise<SubjectOverview | undefined> {
    await simulateNetworkDelay(100);
    return mockSubjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
  },

  async getMarksPerformance(): Promise<{
    subjectMarks: SubjectMarks[];
    semesterTrends: typeof mockSemesterTrend;
    insights: typeof mockPerformanceInsights;
  }> {
    await simulateNetworkDelay(200);
    return {
      subjectMarks: [...mockSubjectMarksList],
      semesterTrends: [...mockSemesterTrend],
      insights: [...mockPerformanceInsights]
    };
  },

  async getSubjectMarks(): Promise<SubjectMarks[]> {
    await simulateNetworkDelay(150);
    return mockSubjectMarksList.map((m) => ({
      ...m,
      sessional1: m.internalSessional1.scored,
      sessional2: m.internalSessional2.scored,
      quizzesScore: m.quizzes.scored,
      assignmentScore: m.assignments.scored,
      labPractical: m.practicals?.scored
    }));
  },

  async getMarksInsights(): Promise<{ id: string; title: string; message: string }[]> {
    await simulateNetworkDelay(100);
    return [...mockPerformanceInsights];
  },

  async getWeeklyTimetable(): Promise<TimetableDaySchedule[]> {
    await simulateNetworkDelay(160);
    return [...mockWeeklyTimetable];
  },

  async getTodayClasses(): Promise<TimetableSlot[]> {
    await simulateNetworkDelay(120);
    // Default to Monday schedule for demonstration
    return [...mockWeeklyTimetable[0].slots];
  }
};
