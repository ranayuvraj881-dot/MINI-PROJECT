import { ChatMessage, DayStudyPlan } from '../types';
import {
  mockCopilotContexts,
  mockDefaultStudyPlan,
  mockInitialChatHistory,
  mockSampleResponses,
  mockSuggestedPrompts,
} from '../data/mock/mockAI';
import { simulateNetworkDelay } from './api';

export interface AISendMessagePayload {
  message: string;
  context: string;
  history: ChatMessage[];
  resourceReferenceId?: string;
}

let activeChatHistory: ChatMessage[] = [...mockInitialChatHistory];
let activeStudyPlan: DayStudyPlan[] = [...mockDefaultStudyPlan];

export const aiService = {
  /**
   * Retrieves default suggested prompts for Campus AI Copilot
   */
  async getSuggestedPrompts(): Promise<string[]> {
    await simulateNetworkDelay(80);
    return [...mockSuggestedPrompts];
  },

  /**
   * Retrieves active copilot context selector options (Notes, Subjects, PYQs, etc.)
   */
  async getContextOptions(): Promise<typeof mockCopilotContexts> {
    await simulateNetworkDelay(50);
    return [...mockCopilotContexts];
  },

  /**
   * Returns current active chat history
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    await simulateNetworkDelay(120);
    return [...activeChatHistory];
  },

  /**
   * Sends user message to Campus AI Copilot
   * Structured for future FastAPI / RAG vector database backend: POST /api/v1/ai/copilot/chat
   */
  async sendMessage(payload: AISendMessagePayload): Promise<ChatMessage> {
    await simulateNetworkDelay(400); // Simulate model generation latency

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      content: payload.message,
      timestamp: 'Just now',
      contextApplied: payload.context,
    };
    activeChatHistory.push(userMsg);

    // Context-aware intelligent fallback response
    const normalized = payload.message.trim().toLowerCase();
    let replyText = mockSampleResponses[normalized];

    if (!replyText) {
      if (normalized.includes('pyq') || normalized.includes('previous year') || normalized.includes('question')) {
        replyText = `### Relevant PYQs Found in GLBITM Repository\n\nI queried past AKTU papers for your query *"${payload.message}"*:\n\n1. **End-Sem 2024 (10 Marks)**: Core theoretical derivation and problem-solving scenario.\n2. **Mid-Sem 2023 (7 Marks)**: Conceptual definition and comparison table.\n\nWould you like me to generate a full step-by-step model solution with grading criteria?`;
      } else if (normalized.includes('attendance') || normalized.includes('bunk') || normalized.includes('miss')) {
        replyText = `### CampusOS Attendance Assessment\n\nYour current overall attendance is **78.4%**. However, **Database Management Systems (KCS-601)** is at **73.0%**, which is below the mandatory 75% limit. You must attend the next 2 classes to avoid debarment.`;
      } else if (normalized.includes('study') || normalized.includes('plan') || normalized.includes('schedule')) {
        replyText = `### Recommended Academic Routine\n\nBased on your active semester workload, I suggest focusing 45 minutes on **DBMS Normalization** and 30 minutes on **Compiler Design LALR parsing**. Your pending assignment in Compiler Design is due tomorrow!`;
      } else {
        replyText = `### Campus AI Academic Analysis\n\nI have analyzed your query *"${payload.message}"* within context **${payload.context}**.\n\n- **Curriculum Alignment**: Checked against AKTU Semester VI syllabus for GL Bajaj Institute of Technology & Management.\n- **Recommendation**: Review Unit 3 lecture handouts and cross-reference with the 2024 End-Sem question patterns in the PYQ library.\n\nFeel free to ask for detailed numerical solutions, pseudocode, or flashcards!`;
      }
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      sender: 'assistant',
      content: replyText,
      timestamp: 'Just now',
      contextApplied: payload.context,
      suggestedFollowups: [
        'Give me 3 practice problems',
        'Summarize key formulas',
        'Add to Smart Study Planner'
      ]
    };

    activeChatHistory.push(assistantMsg);
    return assistantMsg;
  },

  /**
   * Clears conversation history
   */
  async clearChatHistory(): Promise<void> {
    await simulateNetworkDelay(100);
    activeChatHistory = [mockInitialChatHistory[0]];
  },

  /**
   * Retrieves active study plan
   */
  async getStudyPlan(): Promise<DayStudyPlan[]> {
    await simulateNetworkDelay(180);
    return [...activeStudyPlan];
  },

  /**
   * Generates or regenerates dynamic study plan
   * Structured for future AI optimizer: POST /api/v1/ai/study-planner/generate
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
    await simulateNetworkDelay(500);

    const weak = config.weakSubjects || config.focusWeakAreas || [];
    const hours = config.availableStudyHours || config.hoursPerDay || 3;
    const prefTime = config.preferredStudyTime || config.timePreference || 'Evening';

    const regenerated: DayStudyPlan[] = [
      {
        day: 'Monday',
        date: 'Upcoming Weekday',
        focusArea: weak.join(' & ') || 'Core Focus',
        targetHours: hours,
        slots: [
          {
            id: `slot-dyn-1`,
            timeSlot: prefTime === 'Morning' ? '07:00 AM – 08:00 AM' : '06:00 PM – 07:00 PM',
            subjectName: weak[0] || 'Database Management Systems',
            subjectCode: 'KCS-601',
            topic: 'Intensive Concept & Numerical Practice',
            taskType: 'Revision',
            completed: false
          },
          {
            id: `slot-dyn-2`,
            timeSlot: prefTime === 'Morning' ? '08:15 AM – 09:00 AM' : '07:15 PM – 08:00 PM',
            subjectName: config.subjects[1] || 'Operating Systems',
            subjectCode: 'KCS-602',
            topic: 'Past 3-Year AKTU Exam Questions',
            taskType: 'PYQ Practice',
            completed: false
          }
        ]
      },
      {
        day: 'Tuesday',
        date: 'Upcoming Weekday',
        focusArea: 'Compiler Design & System Architecture',
        targetHours: hours,
        slots: [
          {
            id: `slot-dyn-3`,
            timeSlot: prefTime === 'Morning' ? '07:00 AM – 08:00 AM' : '06:00 PM – 07:00 PM',
            subjectName: 'Compiler Design',
            subjectCode: 'KCS-603',
            topic: 'Parsing Algorithms & Conflict Resolution',
            taskType: 'Problem Solving',
            completed: false
          }
        ]
      }
    ];

    activeStudyPlan = regenerated;
    return regenerated;
  },

  /**
   * Retrieves PYQ topic frequency analyses for AI PYQ Analyzer
   */
  async getPYQTopicFrequency(subject?: string): Promise<any[]> {
    await simulateNetworkDelay(180);
    const { mockTopicAnalyses } = await import('../data/mock/mockPYQs');
    if (!subject || subject === 'All') return [...mockTopicAnalyses];
    return mockTopicAnalyses.filter(
      (t) => t.subjectName.toLowerCase().includes(subject.toLowerCase()) || t.subjectCode.toLowerCase() === subject.toLowerCase()
    );
  },

  /**
   * Toggles task completion in study plan
   */
  async toggleSlotCompletion(slotId: string): Promise<DayStudyPlan[]> {
    activeStudyPlan = activeStudyPlan.map((day) => ({
      ...day,
      slots: day.slots.map((s) => (s.id === slotId ? { ...s, completed: !s.completed } : s))
    }));
    return [...activeStudyPlan];
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
    await simulateNetworkDelay(350);
    return {
      strategyTitle: `High-Yield AKTU Strategy: ${subjectCode}`,
      keyTakeaway: 'Unit 3 (Normalization) and Unit 4 (Transactions) account for 48% of total marks in the last 4 years of AKTU exams.',
      focusUnits: [3, 4],
      recommendedHours: 14,
      steps: [
        'Master BCNF vs 3NF numerical decomposition algorithms (Guaranteed 10-mark question).',
        'Practice Precedence Graph conflict serializability testing with 3 transactions.',
        'Review B+ Tree order 4 split operations in Unit 5.',
        'Solve previous 3-year Pre-University Test (PUT) question papers from GLBITM repository.'
      ]
    };
  }
};
