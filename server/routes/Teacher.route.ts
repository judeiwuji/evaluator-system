import { Application } from 'express';
import {
  createTeacherController,
  deleteTeacherController,
  getTeacherController,
  getTeacherDashboardStatsController,
  getTeachersController,
  updateTeacherController,
} from 'server/controllers/Teacher.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class TeacherRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post(
      '/api/teacher/',
      ensureAuthenticated,
      createTeacherController
    );
    this.app.get('/api/teacher/:id', ensureAuthenticated, getTeacherController);
    this.app.get('/api/teachers/', ensureAuthenticated, getTeachersController);
    this.app.put('/api/teacher/', ensureAuthenticated, updateTeacherController);
    this.app.delete(
      '/api/teacher',
      ensureAuthenticated,
      deleteTeacherController
    );
    this.app.get(
      '/api/teacher/dashboard/stats',
      ensureAuthenticated,
      getTeacherDashboardStatsController
    );
  }
}
