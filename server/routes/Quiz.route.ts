import { Application } from 'express';
import {
  createQuizController,
  deleteQuizController,
  generateQuizReportController,
  getQuizController,
  getQuizesController,
  getQuizResultsController,
  updateQuizController,
  validateQuizTokenController,
} from 'server/controllers/Quiz.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';

export default class QuizRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post('/api/quiz/', ensureAuthenticated, createQuizController);
    this.app.get('/api/quiz/', ensureAuthenticated, getQuizController);
    this.app.get('/api/quizzes/', ensureAuthenticated, getQuizesController);
    this.app.put('/api/quiz/', ensureAuthenticated, updateQuizController);
    this.app.delete('/api/quiz', ensureAuthenticated, deleteQuizController);
    this.app.get(
      '/api/quiz/results/:id',
      ensureAuthenticated,
      getQuizResultsController
    );
    this.app.get(
      '/api/quiz/report/:id',
      ensureAuthenticated,
      generateQuizReportController
    );
    this.app.post(
      '/api/quiz/validate/token',
      ensureAuthenticated,
      validateQuizTokenController
    );
  }
}
