import { array, number, object, string } from 'yup';

export const CreateQuestionSchema = object().shape({
  question: string().required('Question is required'),
  answer: string().required('Answer is required'),
  quizId: number().required('Quiz Id is required'),
  options: array().required('Options is required'),
  timeout: number().optional(),
  score: number().optional(),
});

export const UpdateQuestionSchema = object().shape({
  id: number().integer().required('Id is required'),
  question: string().optional(),
  answer: string().optional(),
  quizId: number().optional(),
  timeout: number().optional(),
  score: number().optional(),
});

export const DeleteQuestionSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});

export const CreateQuestionOptionSchema = object().shape({
  questionId: number().integer('Invalid id').required('Id is required'),
  option: string().required('Option is required'),
});

export const UpdateQuestionOptionSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
  option: string().optional(),
});

export const DeleteQuestionOptionSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});

export const UploadQuestionSchema = object().shape({
  quizId: number().required('Quiz is required'),
  filename: string().required('`upload` field is required'),
});
