import { Application } from 'express';
import { createAnswerController } from 'server/controllers/Answer.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class AnswerRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/answer/', ensureAuthenticated, createAnswerController);
  }
}
