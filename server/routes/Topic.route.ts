import { Application } from 'express';
import {
  createTopicController,
  deleteTopicController,
  getTopicController,
  getTopicsController,
  updateTopicController,
} from 'server/controllers/Topic.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class TopicRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/topic/', ensureAuthenticated, createTopicController);
    this.app.get('/api/topic/:id', ensureAuthenticated, getTopicController);
    this.app.get('/api/topics/', ensureAuthenticated, getTopicsController);
    this.app.put('/api/topic/', ensureAuthenticated, updateTopicController);
    this.app.delete('/api/topic', ensureAuthenticated, deleteTopicController);
  }
}
