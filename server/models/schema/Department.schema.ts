import { number, object, string } from 'yup';

export const CreateDepartmentSchema = object().shape({
  name: string().required('Department name is required'),
});

export const UpdateDepartmentSchema = object().shape({
  id: number().integer().required('Id is required'),
  name: string().optional(),
});

export const DeleteDepartmentSchema = object().shape({
  id: number().integer('Invalid id').required('Id is required'),
});
