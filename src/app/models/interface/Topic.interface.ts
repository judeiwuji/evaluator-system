import { Course } from './Course.interface';

export interface CreateTopicRequest {
  title: string;
  description: string;
  courseId: number;
}

export interface UpdateTopicRequest {
  id: number;
  title: string;
  description: string;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  courseId: number;
  course: Course;
  createdAt: string;
  updatedAt: string;
}
