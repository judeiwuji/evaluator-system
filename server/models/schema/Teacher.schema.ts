import { number, object, string } from 'yup';

export const CreateTeacherSchema = object().shape({
  surname: string().required('Surname is required'),
  othernames: string().required('Othernames is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
  deptId: number().integer('Nat valid').required('Department is required'),
});

export const UpdateTeacherSchema = object().shape({
  id: number().integer().required('Id is required'),
  surname: string().optional(),
  othernames: string().optional(),
  email: string().email('Invalid email').optional(),
  deptId: number().integer('Not valid').optional(),
});

export const DeleteTeacherSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
