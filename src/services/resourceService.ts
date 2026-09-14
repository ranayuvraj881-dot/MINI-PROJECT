import { PYQItem, StudyResource, TopicAnalysis } from '../types';
import { mockStudyResourcesList } from '../data/mock/mockNotes';
import { mockPYQList, mockTopicAnalyses } from '../data/mock/mockPYQs';
import { simulateNetworkDelay } from './api';

export const resourceService = {
  async getNotes(filters?: { subjectCode?: string; unit?: string; type?: string; search?: string }): Promise<StudyResource[]> {
    await simulateNetworkDelay(180);
    let list = [...mockStudyResourcesList];

    if (filters?.subjectCode && filters.subjectCode !== 'All') {
      list = list.filter((r) => r.subjectCode === filters.subjectCode);
    }
    if (filters?.unit && filters.unit !== 'All') {
      list = list.filter((r) => r.unit === filters.unit);
    }
    if (filters?.type && filters.type !== 'All') {
      list = list.filter((r) => r.type === filters.type);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.topic.toLowerCase().includes(q) ||
          r.subjectName.toLowerCase().includes(q)
      );
    }

    return list.map(item => ({
      ...item,
      uploadedBy: item.uploadedBy || item.facultyName
    }));
  },

  async getStudyResources(filters?: { subjectCode?: string; unit?: string; type?: string; search?: string }): Promise<StudyResource[]> {
    return resourceService.getNotes(filters);
  },

  async getPYQs(filters?: { subjectCode?: string; unit?: string; year?: number; difficulty?: string; search?: string }): Promise<PYQItem[]> {
    await simulateNetworkDelay(180);
    let list = [...mockPYQList];

    if (filters?.subjectCode && filters.subjectCode !== 'All') {
      list = list.filter((p) => p.subjectCode === filters.subjectCode);
    }
    if (filters?.unit && filters.unit !== 'All') {
      list = list.filter((p) => p.unit === filters.unit);
    }
    if (filters?.year && filters.year > 0) {
      list = list.filter((p) => p.year === filters.year);
    }
    if (filters?.difficulty && filters.difficulty !== 'All') {
      list = list.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.question.toLowerCase().includes(q) ||
          p.topic.toLowerCase().includes(q) ||
          p.subjectName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getTopicAnalyses(subjectCode?: string): Promise<TopicAnalysis[]> {
    await simulateNetworkDelay(150);
    if (!subjectCode || subjectCode === 'All') {
      return [...mockTopicAnalyses];
    }
    return mockTopicAnalyses.filter((t) => t.subjectCode === subjectCode);
  }
};
