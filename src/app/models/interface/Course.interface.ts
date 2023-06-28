import { Teacher } from './User.interface';

export interface CreateCourseRequest {
  title: string;
  code: string;
  teacherId: number;
}

export interface UpdateCourseRequest {
  id: number;
  title: string;
  code: string;
}

export interface Course {
  id: number;
  title: string;
  code: string;
  teacherId: number;
  teacher: Teacher;
  createdAt: string;
  updatedAt: string;
}
