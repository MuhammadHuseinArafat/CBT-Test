
import { ExamSession, UserAnswer } from '../types';

const STORAGE_KEY = 'zenith_cbt_session';

export const storageService = {
  saveSession: (session: ExamSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  getSession: (): ExamSession | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  updateAnswer: (questionId: string, optionId: string) => {
    const session = storageService.getSession();
    if (!session) return;

    const existingAnswerIndex = session.answers.findIndex(a => a.questionId === questionId);
    const newAnswer: UserAnswer = {
      questionId,
      selectedOptionId: optionId,
      timestamp: Date.now()
    };

    if (existingAnswerIndex > -1) {
      session.answers[existingAnswerIndex] = newAnswer;
    } else {
      session.answers.push(newAnswer);
    }

    storageService.saveSession(session);
  }
};
