import { boolean, number, object, string } from 'yup';

export const CreateQuizSchema = object().shape({
  title: string().required('Quiz title is required'),
  active: boolean().required('Active flag is required'),
  topicId: number().required('Topic is required'),
});

export const UpdateQuizSchema = object().shape({
  id: number().integer().required('Id is required'),
  title: string().optional(),
  token: string().optional(),
  active: boolean().optional(),
  topicId: number().optional(),
});

export const DeleteQuizSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});

export const ValidateQuizTokenSchema = object().shape({
  quizId: number().integer('Invalid id').required('Id is required'),
  token: string().required('Token is required'),
});
