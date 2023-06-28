import { number, object, string } from 'yup';

export const CreateTopicSchema = object().shape({
  title: string().required('Topic title is required'),
  description: string().required('Topic description is required'),
  courseId: number().required('Course is required'),
});

export const UpdateTopicSchema = object().shape({
  id: number().integer().required('Id is required'),
  title: string().optional(),
  description: string().optional(),
  courseId: number().optional(),
});

export const DeleteTopicSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
