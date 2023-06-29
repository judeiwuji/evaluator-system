import { Request, Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import {
  CreateTopicSchema,
  DeleteTopicSchema,
  UpdateTopicSchema,
} from 'server/models/schema/Topic.schema';
import {
  CreateTopicRequest,
  DeleteTopicRequest,
  UpdateTopicRequest,
} from 'server/models/Topic.model';
import User from 'server/models/User.model';
import {
  createTopic,
  deleteTopic,
  getTopic,
  getTopics,
  updateTopic,
} from 'server/services/Topic.service';
import { validator } from 'server/utils/yup.util';

export const createTopicController = async (req: AppRequest, res: Response) => {
  const request: CreateTopicRequest = req.body;
  const validation = await validator(CreateTopicSchema, request);
  const user = req.user as User;

  let feedback: Feedback;

  if (validation.isValid) {
    feedback = await createTopic(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const getTopicController = async (req: Request, res: Response) => {
  const { id } = req.params;
  let feedback: Feedback;
  if (id) {
    feedback = await getTopic(Number(id));
  } else {
    feedback = new Feedback(false, 'id not found');
  }
  res.json(feedback);
};

export const getTopicsController = async (req: Request, res: Response) => {
  const { search, cid } = req.query;
  const page = Number(req.query['page']) || 1;
  const courseId = cid ? Number(cid) : 0;
  let feedback = await getTopics(page, courseId, `${search}`);
  res.json(feedback);
};

export const updateTopicController = async (req: AppRequest, res: Response) => {
  const request: UpdateTopicRequest = req.body;
  const validation = await validator(UpdateTopicSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateTopic(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};

export const deleteTopicController = async (req: AppRequest, res: Response) => {
  const request: DeleteTopicRequest = req.body;
  const validation = await validator(DeleteTopicSchema, request);
  const user = req.user as User;

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await deleteTopic(request, user);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
