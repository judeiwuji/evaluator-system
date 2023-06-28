import { Student, User } from '@prisma/client';
import { Request, Response } from 'express';
import { CreateAnswerRequest } from 'server/models/Answer.model';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import { CreateAnswerSchema } from 'server/models/schema/Answer.schema';
import { createAnswer } from 'server/services/Answer.service';
import { validator } from 'server/utils/yup.util';

export const createAnswerController = async (
  req: AppRequest,
  res: Response
) => {
  const user = req.user as User & { student: Student };
  const request: CreateAnswerRequest = req.body;
  request.studentId = user.student.id;
  const validation = await validator(CreateAnswerSchema, request);

  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createAnswer(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
