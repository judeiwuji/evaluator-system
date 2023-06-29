import { Request, Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  UpdateQuizRequest,
  ValidateQuizTokenRequest,
} from 'server/models/Quiz.model';
import User from 'server/models/User.model';
import {
  CreateQuizSchema,
  DeleteQuizSchema,
  UpdateQuizSchema,
  ValidateQuizTokenSchema,
} from 'server/models/schema/Quiz.schema';
import {
  createQuiz,
  deleteQuiz,
  generateQuizReport,
  getQuiz,
  getQuizes,
  getQuizResults,
  updateQuiz,
  validateQuizToken,
} from 'server/services/Quiz.service';
import { validator } from 'server/utils/yup.util';

export const createQuizController = async (req: AppRequest, res: Response) => {
  const request: CreateQuizRequest = req.body;
  const validation = await validator(CreateQuizSchema, request);
  const user = req.user as User;

  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createQuiz(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getQuizController = async (req: Request, res: Response) => {
  const { id, token } = req.query;
  let feedback: Feedback;
  if (id) {
    feedback = await getQuiz({ id: Number(id) });
  } else if (token) {
    feedback = await getQuiz({ token });
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getQuizesController = async (req: Request, res: Response) => {
  const { search, tid, active } = req.query;
  const page = Number(req.query['page']) || 1;
  const topicId = tid ? Number(tid) : 0;
  const isActive = active === 'true';
  let feedback = await getQuizes(page, topicId, `${search}`, isActive);
  res.json(feedback);
};

export const updateQuizController = async (req: AppRequest, res: Response) => {
  const request: UpdateQuizRequest = req.body;
  const validation = await validator(UpdateQuizSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuiz(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuizController = async (req: AppRequest, res: Response) => {
  const request: DeleteQuizRequest = req.body;
  const validation = await validator(DeleteQuizSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuiz(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getQuizResultsController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const feedback = await getQuizResults(Number(id));
  res.json(feedback);
};

export const generateQuizReportController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const feedback = await generateQuizReport(Number(id));
  res.json(feedback);
};

export const validateQuizTokenController = async (
  req: Request,
  res: Response
) => {
  const request: ValidateQuizTokenRequest = req.body;
  const validation = await validator(ValidateQuizTokenSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await validateQuizToken(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
  }
  res.json(feedback);
};
