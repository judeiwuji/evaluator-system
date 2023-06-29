import { Application } from 'express';
import {
  changePasswordController,
  currentUserController,
  getLevelsController,
  installAppController,
  loginController,
  logoutController,
  resetPasswordController,
} from 'server/controllers/App.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class AppRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/login/', loginController);
    this.app.post('/api/logout/', logoutController);
    this.app.post(
      '/api/change/password',
      ensureAuthenticated,
      changePasswordController
    );
    this.app.post('/api/reset/password', resetPasswordController);
    this.app.get(
      '/api/current/user',
      ensureAuthenticated,
      currentUserController
    );
    this.app.get('/api/levels', getLevelsController);
    this.app.post('/api/install/', installAppController);
  }
}
