import { Question } from './Question.interface';
import { Student } from './User.interface';

export interface CreateAnswerRequest {
  answer: string;
  questionId: number;
  quizId: number;
}

export interface Answer {
  id: number;
  answer: string;
  questionId: number;
  question: Question;
  studentId: number;
  student: Student;
  createdAt: string;
  updatedAt: string;
}
