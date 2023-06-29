import { Request, Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  UpdateDepartmentRequest,
} from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import User from 'server/models/User.model';
import {
  CreateDepartmentSchema,
  DeleteDepartmentSchema,
  UpdateDepartmentSchema,
} from 'server/models/schema/Department.schema';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from 'server/services/Department.service';
import { validator } from 'server/utils/yup.util';

export const createDepartmentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: CreateDepartmentRequest = req.body;
  const validation = await validator(CreateDepartmentSchema, request);
  const user = req.user as User;
  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createDepartment(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getDepartmentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getDepartment(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getDepartmentsController = async (req: Request, res: Response) => {
  const { search, paginate } = req.query;
  const page = Number(req.query['page']) || 1;
  let feedback = await getDepartments(page, `${search}`, paginate === 'true');
  res.json(feedback);
};

export const updateDepartmentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: UpdateDepartmentRequest = req.body;
  const validation = await validator(UpdateDepartmentSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateDepartment(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteDepartmentController = async (
  req: AppRequest,
  res: Response
) => {
  const request: DeleteDepartmentRequest = req.body;
  const validation = await validator(DeleteDepartmentSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteDepartment(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
