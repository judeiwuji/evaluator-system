import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateQuestionOptionRequest,
  CreateQuestionRequest,
  DeleteQuestionOptionRequest,
  DeleteQuestionRequest,
  ProcessQuestionUploadRequest,
  UpdateQuestionOptionRequest,
  UpdateQuestionRequest,
} from 'server/models/Question.model';
import { DeleteAdminSchema } from 'server/models/schema/Admin.schema';
import {
  CreateQuestionOptionSchema,
  CreateQuestionSchema,
  DeleteQuestionOptionSchema,
  DeleteQuestionSchema,
  UpdateQuestionOptionSchema,
  UpdateQuestionSchema,
  UploadQuestionSchema,
} from 'server/models/schema/Question.schema';
import {
  createQuestion,
  createQuestionOption,
  deleteQuestion,
  deleteQuestionOption,
  getQuestion,
  getQuestions,
  processQuestionUpload,
  updateQuestion,
  updateQuestionOption,
} from 'server/services/Question.service';
import { validator } from 'server/utils/yup.util';

export const createQuestionController = async (req: Request, res: Response) => {
  const request: CreateQuestionRequest = req.body;
  const validation = await validator(CreateQuestionSchema, request);
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getQuestionController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getQuestion(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getQuestionsController = async (
  req: AppRequest,
  res: Response
) => {
  const { search, qid, paginate, time } = req.query;
  const page = Number(req.query['page']) || 1;
  const quizId = qid ? Number(qid) : 0;
  const user: any = req.user;

  let feedback = await getQuestions(
    page,
    quizId,
    user,
    `${search}`,
    paginate === 'true',
    Number(time)
  );
  res.json(feedback);
};

export const updateQuestionController = async (req: Request, res: Response) => {
  const request: UpdateQuestionRequest = req.body;
  const validation = await validator(UpdateQuestionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuestionController = async (req: Request, res: Response) => {
  const request: DeleteQuestionRequest = req.body;
  const validation = await validator(DeleteQuestionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuestion(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const createQuestionOptionController = async (
  req: AppRequest,
  res: Response
) => {
  const request: CreateQuestionOptionRequest = req.body;
  const validation = await validator(CreateQuestionOptionSchema, request);
  const user = req.user as User;
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await createQuestionOption(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const updateQuestionOptionController = async (
  req: AppRequest,
  res: Response
) => {
  const request: UpdateQuestionOptionRequest = req.body;
  const validation = await validator(UpdateQuestionOptionSchema, request);
  const user = req.user as User;
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateQuestionOption(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteQuestionOptionController = async (
  req: AppRequest,
  res: Response
) => {
  const request: DeleteQuestionOptionRequest = req.body;
  const validation = await validator(DeleteQuestionOptionSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteQuestionOption(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const uploadQuestionController = async (req: Request, res: Response) => {
  const request = new ProcessQuestionUploadRequest(
    req.body.quizId,
    req.file?.path as string
  );
  const validation = await validator(UploadQuestionSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await processQuestionUpload(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
  }
  res.json(feedback);
};
