import { Quiz } from '@prisma/client';

export interface CreateQuestionRequest {
  question: string;
  answer: string;
  timeout: number;
  score: number;
  quizId: number;
  options: string[];
}

export interface UpdateQuestionRequest {
  id: number;
  question?: string;
  answer?: string;
  timeout?: number;
  score?: number;
}

export interface Question {
  id: number;
  question: string;
  answer?: string;
  timeout: number;
  score: number;
  quizId: number;
  quiz: Quiz;
  options: Option[];
  createdAt: string;
  updatedAt: string;
}

export interface Option {
  id: number;
  option: string;
  questionId: number;
  isEditMode: boolean;
}

export interface UpdateOptionRequest {
  id: number;
  option?: string;
}

export interface CreateOptionRequest {
  questionId: number;
  option: string;
}

export interface QuestionUploadTemplate {
  Score: number;
  Timeout: number;
  Question: string;
  Answer: string;
  OptionA?: string;
  OptionB?: string;
  OptionC?: string;
  OptionD?: string;
}
