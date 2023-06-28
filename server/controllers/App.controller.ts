import { compareSync } from 'bcryptjs';
import { Request, Response } from 'express';
import { decode } from 'jsonwebtoken';
import {
  AppRequest,
  ChangePasswordRequest,
  CreateAccesTokenRequest,
  LoginRequest,
  ResetPasswordRequest,
} from 'server/models/App.model';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import {
  ChangePasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
} from 'server/models/schema/App.schema';
import {
  changePassword,
  createAccessToken,
  getLevels,
  logout,
  resetPassword,
} from 'server/services/App.service';
import { getUser, getUserActivities } from 'server/services/User.service';
import { validator } from 'server/utils/yup.util';

export const loginController = async (req: Request, res: Response) => {
  const request: LoginRequest = req.body;
  const validation = await validator(LoginSchema, request);
  let feedback: Feedback;

  try {
    if (validation.isValid) {
      const user = await getUser({ email: request.email });
      if (user) {
        console.log(request.password, user.password);
        const isMatch = compareSync(request.password, user.password);
        if (isMatch) {
          const accessToken = await createAccessToken(
            new CreateAccesTokenRequest(
              user.id,
              user.type,
              req.headers['user-agent'] as string
            )
          );
          res.setHeader('x-access', accessToken);
          // global.localStorage.setItem('x-access', accessToken);
          feedback = new Feedback(true, 'success');
          switch (user.type) {
            case UserType.Admin:
              feedback.redirect = '/admin/dashboard';
              break;
            case UserType.Teacher:
              feedback.redirect = '/teacher/dashboard';
              break;
            case UserType.Student:
              feedback.redirect = '/student/dashboard';
              break;
          }
        } else {
          feedback = new Feedback(
            false,
            'Wrong email and password combination.'
          );
        }
      } else {
        feedback = new Feedback(false, 'Wrong email and password combination.');
      }
    } else {
      feedback = new Feedback(false, 'Credentials is required');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  res.json(feedback);
};

export const logoutController = async (req: AppRequest, res: Response) => {
  let feedback: Feedback;
  const authorization = req.headers['authorization'];

  if (authorization) {
    const accessToken = authorization.split(' ')[1];
    const decoded: any = decode(accessToken);
    if (decoded) {
      console.log('App logout: ' + decoded.token);
      feedback = await logout(decoded.token as string);
    } else {
      feedback = new Feedback(false, 'Operation failed');
    }
  } else {
    feedback = new Feedback(false, 'Already Logged Out');
  }
  res.json(feedback);
};

export const changePasswordController = async (
  req: AppRequest,
  res: Response
) => {
  const request: ChangePasswordRequest = req.body;
  const validation = await validator(ChangePasswordSchema, request);
  const user = req.user;
  let feedback: Feedback;
  if (validation.isValid) {
    if (user) {
      feedback = await changePassword(request, user.id);
    } else {
      feedback = new Feedback(false, 'User record not found');
    }
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }
  res.json(feedback);
};
export const resetPasswordController = async (
  req: AppRequest,
  res: Response
) => {
  const request: ResetPasswordRequest = req.body;
  const validation = await validator(ResetPasswordSchema, request);

  let feedback: Feedback;
  if (validation.isValid) {
    feedback = await resetPassword(request);
  } else {
    feedback = new Feedback(false, validation.errors.join(','));
    feedback.errors = validation.errors;
  }

  res.json(feedback);
};

export const currentUserController = async (req: AppRequest, res: Response) => {
  let feedback: Feedback;
  const user = req.user;
  if (user) {
    feedback = new Feedback(true, 'success');
    feedback.result = user;
  } else {
    feedback = new Feedback(false, 'User record not found');
  }
  res.json(feedback);
};

export const getLevelsController = async (req: Request, res: Response) => {
  let feedback: Feedback = await getLevels();
  res.json(feedback);
};
