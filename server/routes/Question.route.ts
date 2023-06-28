import { Application } from 'express';
import {
  createQuestionController,
  createQuestionOptionController,
  deleteQuestionController,
  deleteQuestionOptionController,
  getQuestionController,
  getQuestionsController,
  updateQuestionController,
  updateQuestionOptionController,
  uploadQuestionController,
} from 'server/controllers/Question.controller';
import { ensureAuthenticated } from 'server/middlewares/auth.middleware';
import * as multer from 'multer';
import * as path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../public/questions/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const questionUploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return cb(new Error('File type not accepted'));
    }
    cb(null, true);
  },
});

export default class QuestionRoute {
  constructor(private app: Application) {
    this.register();
  }

  private register() {
    this.app.post(
      '/api/question/',
      ensureAuthenticated,
      createQuestionController
    );
    this.app.get(
      '/api/question/:id',
      ensureAuthenticated,
      getQuestionController
    );
    this.app.get(
      '/api/questions/',
      ensureAuthenticated,
      getQuestionsController
    );
    this.app.put(
      '/api/question/',
      ensureAuthenticated,
      updateQuestionController
    );
    this.app.delete(
      '/api/question',
      ensureAuthenticated,
      deleteQuestionController
    );
    this.app.post(
      '/api/question/option/',
      ensureAuthenticated,
      createQuestionOptionController
    );
    this.app.put(
      '/api/question/option/',
      ensureAuthenticated,
      updateQuestionOptionController
    );
    this.app.delete(
      '/api/question/option/',
      ensureAuthenticated,
      deleteQuestionOptionController
    );
    this.app.post(
      '/api/questions/upload/',
      questionUploader.single('upload'),
      uploadQuestionController
    );
  }
}
