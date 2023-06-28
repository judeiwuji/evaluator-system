import { Student, User } from '@prisma/client';
import { Request, Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateStudentSchema,
  DeleteStudentSchema,
  UpdateStudentSchema,
} from 'server/models/schema/Student.schema';
import {
  CreateStudentRequest,
  DeleteStudentRequest,
  UpdateStudentRequest,
} from 'server/models/Student.model';
import {
  createStudent,
  deleteStudent,
  getStudent,
  getStudentQuizResult,
  getStudentQuizzesResult,
  getStudents,
  updateStudent,
} from 'server/services/Student.service';
import { validator } from 'server/utils/yup.util';

export const createStudentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: CreateStudentRequest = req.body;
  const validation = await validator(CreateStudentSchema, request);
  const user = req.user as User;

  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createStudent(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getStudentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getStudent(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getStudentsController = async (req: Request, res: Response) => {
  const { search } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getStudents(page, `${search}`);
  res.json(feedback);
};

export const updateStudentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: UpdateStudentRequest = req.body;
  const validation = await validator(UpdateStudentSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateStudent(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteStudentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: DeleteStudentRequest = req.body;
  const validation = await validator(DeleteStudentSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteStudent(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getStudentQuizResultController = async (
  req: Request,
  res: Response
) => {
  const { studentId, quizId } = req.params;
  let feedback: Feedback = await getStudentQuizResult(
    Number(studentId),
    Number(quizId)
  );
  res.json(feedback);
};

export const getStudentQuizzesResultController = async (
  req: AppRequest,
  res: Response
) => {
  const user = req.user as User & { student: Student };
  const feedback = await getStudentQuizzesResult(Number(user.student.id));
  res.json(feedback);
};
