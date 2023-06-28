import { Application } from 'express';
import {
  deleteUserActivityController,
  getUserActivitiesController,
  updateUserController,
  uploadAvatarController,
} from 'server/controllers/User.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';
import * as multer from 'multer';
import { getMulterStorage } from 'server/utils/multer.util';
const uploadAvatar = multer({ storage: getMulterStorage() });

export default class UserRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.get(
      '/api/user/activities/:month',
      ensureAuthenticated,
      getUserActivitiesController
    );
    this.app.put('/api/user/', ensureAuthenticated, updateUserController);
    this.app.delete(
      '/api/user/activity',
      ensureAuthenticated,
      deleteUserActivityController
    );
    this.app.post(
      '/api/user/upload',
      ensureAuthenticated,
      uploadAvatar.single('avatar'),
      uploadAvatarController
    );
  }
}
