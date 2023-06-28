import { number, object, string } from 'yup';

export const CreateAnswerSchema = object().shape({
  answer: string().optional(),
  questionId: number().required('Question Id is required'),
  quizId: number().required('Quiz Id is required'),
  studentId: number().required('Student Id is required'),
});
