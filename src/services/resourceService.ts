import { PYQItem, StudyResource, TopicAnalysis } from '../types';
import { apiClient } from './api';

export interface CreateNotePayload {
  title: string;
  subjectCode: string;
  unit: string;
  topic: string;
  type?: string;
  fileSize?: string;
  downloadUrl?: string;
  summary?: string;
}

export interface CreatePYQPayload {
  question: string;
  subjectCode: string;
  subjectName?: string;
  semester?: string;
  year: number | string;
  unit: string;
  examType?: string;
  difficulty?: string;
  frequency?: number;
  topic: string;
  marksWeightage?: number;
}

export const resourceService = {
  /**
   * Retrieves notes and study resources matching optional filters.
   */
  async getNotes(filters?: { subjectCode?: string; semester?: string; unit?: string; type?: string; search?: string }): Promise<StudyResource[]> {
    const params = new URLSearchParams();
    if (filters?.subjectCode && filters.subjectCode !== 'All') params.append('subjectCode', filters.subjectCode);
    if (filters?.semester && filters.semester !== 'All') params.append('semester', filters.semester);
    if (filters?.unit && filters.unit !== 'All') params.append('unit', filters.unit);
    if (filters?.type && filters.type !== 'All') params.append('type', filters.type);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const items = await apiClient<StudyResource[]>(`/resources/notes${queryString}`);

    return items.map((item) => ({
      ...item,
      uploadedBy: item.uploadedBy || item.facultyName,
    }));
  },

  /**
   * Alias for getNotes for uniform consumption.
   */
  async getStudyResources(filters?: { subjectCode?: string; semester?: string; unit?: string; type?: string; search?: string }): Promise<StudyResource[]> {
    return this.getNotes(filters);
  },

  /**
   * Teacher uploads a new study note / lecture resource.
   */
  async uploadNote(payload: CreateNotePayload): Promise<StudyResource> {
    return await apiClient<StudyResource>('/resources/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher deletes an uploaded note.
   */
  async deleteNote(noteId: string): Promise<{ success: boolean; message: string }> {
    return await apiClient<{ success: boolean; message: string }>(`/resources/notes/${noteId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Retrieves AKTU previous year questions with filters.
   */
  async getPYQs(filters?: { subjectCode?: string; semester?: string; unit?: string; year?: number; difficulty?: string; search?: string }): Promise<PYQItem[]> {
    const params = new URLSearchParams();
    if (filters?.subjectCode && filters.subjectCode !== 'All') params.append('subjectCode', filters.subjectCode);
    if (filters?.semester && filters.semester !== 'All') params.append('semester', filters.semester);
    if (filters?.unit && filters.unit !== 'All') params.append('unit', filters.unit);
    if (filters?.year && filters.year > 0) params.append('year', filters.year.toString());
    if (filters?.difficulty && filters.difficulty !== 'All') params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    return await apiClient<PYQItem[]>(`/resources/pyqs${queryString}`);
  },

  /**
   * Teacher uploads an AKTU Previous Year Question (PYQ).
   */
  async uploadPYQ(payload: CreatePYQPayload): Promise<PYQItem> {
    return await apiClient<PYQItem>('/resources/pyqs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Teacher deletes a PYQ question.
   */
  async deletePYQ(pyqId: string): Promise<{ success: boolean; message: string }> {
    return await apiClient<{ success: boolean; message: string }>(`/resources/pyqs/${pyqId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Retrieves topic frequency analysis for AKTU exam trends.
   */
  async getTopicAnalyses(subjectCode?: string): Promise<TopicAnalysis[]> {
    const query = subjectCode && subjectCode !== 'All' ? `?subjectCode=${encodeURIComponent(subjectCode)}` : '';
    return await apiClient<TopicAnalysis[]>(`/resources/pyqs/topics${query}`);
  }
};

