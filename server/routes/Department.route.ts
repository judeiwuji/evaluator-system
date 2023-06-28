import { Application } from 'express';
import {
  createDepartmentController,
  deleteDepartmentController,
  getDepartmentController,
  getDepartmentsController,
  updateDepartmentController,
} from 'server/controllers/Department.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class DepartmentRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post(
      '/api/department/',
      ensureAuthenticated,
      createDepartmentController
    );
    this.app.get(
      '/api/department/:id',
      ensureAuthenticated,
      getDepartmentController
    );
    this.app.get('/api/departments/', getDepartmentsController);
    this.app.put(
      '/api/department/',
      ensureAuthenticated,
      updateDepartmentController
    );
    this.app.delete(
      '/api/department',
      ensureAuthenticated,
      deleteDepartmentController
    );
  }
}
