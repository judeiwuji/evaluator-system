import { number, object, string } from 'yup';

export const CreateCourseSchema = object().shape({
  code: string().required('Course code is required'),
  title: string().required('Course title is required'),
  teacherId: number().required('Teacher Id is required'),
});

export const UpdateCourseSchema = object().shape({
  id: number().integer().required('Id is required'),
  code: string().optional(),
  title: string().optional(),
});

export const DeleteCourseSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
