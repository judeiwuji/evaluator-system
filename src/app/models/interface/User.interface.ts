import { Department } from './Department.interface';

export interface User {
  surname: string;
  othernames: string;
  email: string;
  type: string;
  avatar: string;
  admin?: Admin;
  student?: Student;
  teacher?: Teacher;
}

export interface Admin {
  id: number;
  userId: number;
  user: User;
}

export interface Student {
  id: number;
  userId: number;
  deptId: number;
  levelId: number;
  regNo: string;
  level?: Level;
  department?: Department;
  user: User;
}

export interface Teacher {
  id: number;
  userId: number;
  deptId: number;
  department?: any;
  user: User;
}

export interface Level {
  id: number;
  name: string;
}

export interface Activity {
  id: number;
  content: string;
  userId: number;
  user: User;
  createdAt: string;
}

export interface UpdateUserRequest {
  surname?: string;
  othernames?: string;
  email?: string;
}
