import { object, string } from 'yup';

export const LoginSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
  password: string().required('Password is required'),
});

export const ChangePasswordSchema = object().shape({
  oldPassword: string().required('Old password is required'),
  newPassword: string().required('New password is required'),
});

export const ResetPasswordSchema = object().shape({
  email: string().email('Invalid email').required('Email is required'),
});
