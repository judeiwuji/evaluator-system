import { Application } from 'express';
import {
  createCourseController,
  deleteCourseController,
  getCourseController,
  getCoursesController,
  updateCourseController,
} from 'server/controllers/Course.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class CourseRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/course/', ensureAuthenticated, createCourseController);
    this.app.get('/api/course/:id', ensureAuthenticated, getCourseController);
    this.app.get('/api/courses/', ensureAuthenticated, getCoursesController);
    this.app.put('/api/course/', ensureAuthenticated, updateCourseController);
    this.app.delete('/api/course', ensureAuthenticated, deleteCourseController);
  }
}
