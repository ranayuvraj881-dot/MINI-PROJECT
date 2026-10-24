import { ChatMessage, DayStudyPlan } from '../types';
import { apiClient } from './api';

export interface AISendMessagePayload {
  message: string;
  context: string;
  history?: ChatMessage[];
  resourceReferenceId?: string;
}

export const aiService = {
  /**
   * Retrieves default suggested prompts for Campus AI Copilot
   */
  async getSuggestedPrompts(): Promise<string[]> {
    return await apiClient<string[]>('/ai/copilot/prompts');
  },

  /**
   * Retrieves active copilot context selector options (Notes, Subjects, PYQs, etc.)
   */
  async getContextOptions(): Promise<{ id: string; label: string; icon: string; description: string }[]> {
    return await apiClient<{ id: string; label: string; icon: string; description: string }[]>('/ai/copilot/contexts');
  },

  /**
   * Returns current active chat history from persistent database
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    return await apiClient<ChatMessage[]>('/ai/copilot/history');
  },

  /**
   * Sends user message to Campus AI Copilot via POST /api/v1/ai/copilot/chat
   * Grounded in real student attendance, marks, and AKTU curriculum.
   */
  async sendMessage(payload: AISendMessagePayload): Promise<ChatMessage> {
    return await apiClient<ChatMessage>('/ai/copilot/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: payload.message,
        context: payload.context,
        history: payload.history,
        resourceReferenceId: payload.resourceReferenceId,
      }),
    });
  },

  /**
   * Clears conversation history in database
   */
  async clearChatHistory(): Promise<void> {
    await apiClient('/ai/copilot/history', { method: 'DELETE' });
  },

  /**
   * Retrieves active study plan from persistent database
   */
  async getStudyPlan(): Promise<DayStudyPlan[]> {
    return await apiClient<DayStudyPlan[]>('/study-planner');
  },

  /**
   * Generates or regenerates dynamic study plan via POST /api/v1/study-planner/generate
   */
  async generateStudyPlan(config: {
    examDates?: string;
    targetDate?: string;
    subjects: string[];
    availableStudyHours?: number;
    hoursPerDay?: number;
    weakSubjects?: string[];
    focusWeakAreas?: string[];
    preferredStudyTime?: string;
    timePreference?: string;
  }): Promise<DayStudyPlan[]> {
    return await apiClient<DayStudyPlan[]>('/study-planner/generate', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  },

  /**
   * Retrieves PYQ topic frequency analyses for AI PYQ Analyzer
   */
  async getPYQTopicFrequency(subject?: string): Promise<any[]> {
    const query = subject && subject !== 'All' ? `?subject=${encodeURIComponent(subject)}` : '';
    return await apiClient<any[]>(`/resources/pyqs/topics${query}`);
  },

  /**
   * Toggles task completion in study plan and persists to database
   */
  async toggleSlotCompletion(slotId: string): Promise<DayStudyPlan[]> {
    return await apiClient<DayStudyPlan[]>(`/study-planner/slot/${encodeURIComponent(slotId)}/toggle`, {
      method: 'POST',
    });
  },

  /**
   * Generates AI Preparation Strategy for PYQ Analyzer
   */
  async generatePYQStrategy(subjectCode: string): Promise<{
    strategyTitle: string;
    keyTakeaway: string;
    focusUnits: number[];
    recommendedHours: number;
    steps: string[];
  }> {
    return await apiClient<{
      strategyTitle: string;
      keyTakeaway: string;
      focusUnits: number[];
      recommendedHours: number;
      steps: string[];
    }>(`/resources/pyqs/strategy?subjectCode=${encodeURIComponent(subjectCode)}`);
  }
};
