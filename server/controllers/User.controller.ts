import { Response } from 'express';
import { AppRequest } from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import { UpdateUserSchema } from 'server/models/schema/User.schema';
import User, {
  DeleteUserActivityRequest,
  UpdateUserRequest,
  UploadAvatarRequest,
} from 'server/models/User.model';
import {
  deleteUserActivity,
  getUserActivities,
  updateUser,
} from 'server/services/User.service';
import { validator } from 'server/utils/yup.util';

export const getUserActivitiesController = async (
  req: AppRequest,
  res: Response
) => {
  const { month } = req.params;
  const user = req.user;
  let feedback: Feedback;
  if (user) {
    feedback = await getUserActivities(user.id, Number(month));
  } else {
    feedback = new Feedback(false, 'User record not found');
  }
  res.json(feedback);
};

export const updateUserController = async (req: AppRequest, res: Response) => {
  const request: UpdateUserRequest = req.body;
  const { id } = req.user as User;
  request.id = Number(id);
  const validation = await validator(UpdateUserSchema, request);
  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await updateUser(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
  }
  res.json(feedback);
};

export const deleteUserActivityController = async (
  req: AppRequest,
  res: Response
) => {
  const request: DeleteUserActivityRequest = req.body;
  const feedback = await deleteUserActivity(request);
  res.json(feedback);
};

export const uploadAvatarController = async (
  req: AppRequest,
  res: Response
) => {
  const user = req.user as User;
  const request = new UploadAvatarRequest(
    process.env['NODE_ENV'] === 'production'
      ? (req.file?.path as string)
      : (req.file?.filename as string),
    user.id
  );
  const feedback = await updateUser({ id: user.id, avatar: request.filepath });
  if (feedback.success) {
    feedback.result = request.filepath;
  }
  return res.json(feedback);
};
