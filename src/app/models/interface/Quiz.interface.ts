import { Topic } from './Topic.interface';
import { Student } from './User.interface';

export interface CreateQuizRequest {
  token?: string;
  active: boolean;
  title: string;
  topicId: number;
}

export interface UpdateQuizRequest {
  id: number;
  token?: string;
  active?: boolean;
  title?: string;
}

export interface Quiz {
  id: number;
  title: string;
  token: string;
  active: boolean;
  topicId: number;
  topic: Topic;
  createdAt: string;
  updatedAt: string;
}

export interface QuizResult {
  score: number;
  totalScore: number;
  position: number;
  student: Student;
}

export interface ReportDataset {
  label: string;
  data: number[];
}

export interface QuizReport {
  labels: string[];
  dataset: ReportDataset[];
}
export interface ValidateQuizTokenRequest {
  quizId: number;
  token: string;
}
