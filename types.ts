
export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  timestamp: number;
}

export interface ExamSession {
  id: string;
  studentName: string;
  studentId: string;
  studentClass: string;
  startTime: number;
  endTime?: number;
  answers: UserAnswer[];
  isSubmitted: boolean;
}

export interface ExamConfig {
  title: string;
  durationMinutes: number;
  totalQuestions: number;
}
