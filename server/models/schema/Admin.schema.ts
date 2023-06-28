import { number, object, string } from 'yup';

export const CreateAdminSchema = object().shape({
  surname: string().required('Surname is required'),
  othernames: string().required('Othernames is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
});

export const UpdateAdminSchema = object().shape({
  id: number().integer().required('Id is required'),
  surname: string().optional(),
  othernames: string().optional(),
  email: string().email('Invalid email').optional(),
});

export const DeleteAdminSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
