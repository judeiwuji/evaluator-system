import { number, object, string } from 'yup';

export const UpdateUserSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
  surname: string().optional(),
  othernames: string().optional(),
  email: string().optional(),
});
