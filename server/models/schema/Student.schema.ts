import { number, object, string } from 'yup';

export const CreateStudentSchema = object().shape({
  surname: string().required('Surname is required'),
  othernames: string().required('Othernames is required'),
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
  regNo: string()
    .min(5, 'RegNo must be at least 5 characters')
    .required('RegNo is required'),
  deptId: number().integer('Nat valid').required('Department is required'),
  levelId: number().integer('Not valid').required('Level is required'),
});

export const UpdateStudentSchema = object().shape({
  id: number().integer().required('Id is required'),
  surname: string().optional(),
  othernames: string().optional(),
  email: string().email('Invalid email').optional(),
  regNo: string().min(5, 'RegNo must be at least 5 characters'),
  deptId: number().integer('Not valid').optional(),
  levelId: number().integer('Not valid').optional(),
});

export const DeleteStudentSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
