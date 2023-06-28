import { Application } from 'express';
import {
  createAdminController,
  deleteAdminController,
  getAdminController,
  getAdminDashboardStatsController,
  getAdminsController,
  updateAdminController,
} from 'server/controllers/Admin.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class AdminRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/admin/', ensureAuthenticated, createAdminController);
    this.app.get('/api/admin/:id', ensureAuthenticated, getAdminController);
    this.app.get('/api/admins/', ensureAuthenticated, getAdminsController);
    this.app.put('/api/admin/', ensureAuthenticated, updateAdminController);
    this.app.delete('/api/admin', ensureAuthenticated, deleteAdminController);
    this.app.get(
      '/api/admin/dashboard/stats',
      ensureAuthenticated,
      getAdminDashboardStatsController
    );
  }
}
