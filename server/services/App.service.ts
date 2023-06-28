import { PrismaClient } from '@prisma/client';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import {
  ChangePasswordRequest,
  CreateAccesTokenRequest,
  RefreshAccessTokenRequest,
  ResetPasswordRequest,
} from 'server/models/App.model';
import { Feedback } from 'server/models/Feedback.model';
import { signToken } from 'server/utils/jwt.util';
import * as crypto from 'crypto';
import prisma from '../utils/prisma.util';

const ACCESS_TOKEN_TIMEOUT = process.env['ACCESS_TOKEN_TIMEOUT'] as string;
const REFRESH_TOKEN_TIMEOUT = process.env['REFRESH_TOKEN_TIMEOUT'] as string;
const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createAccessToken = async (request: CreateAccesTokenRequest) => {
  const token = signToken({ user: request.userId }, REFRESH_TOKEN_TIMEOUT);
  const refreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId: request.userId,
      userAgent: request.userAgent,
      createdAt: new Date(),
    },
  });

  const accessToken = `Bearer ${signToken(
    {
      token: refreshToken.id,
      user: refreshToken.userId,
      type: request.userType,
    },
    ACCESS_TOKEN_TIMEOUT
  )}`;
  return accessToken;
};

export const refreshAccessToken = async (
  request: RefreshAccessTokenRequest
) => {
  let accessToken: string;
  try {
    const token = signToken({ userId: request.userId }, REFRESH_TOKEN_TIMEOUT);
    await prisma.refreshToken.update({
      data: { token },
      where: { id: request.id },
    });
    accessToken = `Bearer ${signToken(
      { token: request.id, user: request.userId, type: request.userType },
      ACCESS_TOKEN_TIMEOUT
    )}`;
  } catch (error) {
    console.log(error);
    accessToken = '';
  }

  return accessToken;
};

export const logout = async (id: string) => {
  let feedback: Feedback;
  try {
    await prisma.refreshToken.update({
      data: { valid: false },
      where: { id },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getRefreshToken = async (filter: any) => {
  return await prisma.refreshToken.findFirst({ where: filter });
};

export const changePassword = async (
  request: ChangePasswordRequest,
  userId: number
) => {
  let feedback: Feedback;
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    const isMatch = compareSync(request.oldPassword, user?.password as string);
    if (isMatch) {
      const salt = genSaltSync(SALT_ROUND);
      const hash = hashSync(request.newPassword, salt);
      await prisma.user.update({
        data: { password: hash },
        where: { id: userId },
      });
      feedback = new Feedback(true, 'success');
      // Track Activity
      await prisma.activity.create({
        data: {
          userId: userId,
          content: `changed password`,
          createdAt: new Date(),
        },
      });
    } else {
      feedback = new Feedback(false, 'Incorrect old password.');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const resetPassword = async (request: ResetPasswordRequest) => {
  let feedback: Feedback;
  try {
    const user = await prisma.user.findFirst({
      where: { email: request.email },
    });
    if (user) {
      const password = crypto.randomBytes(6).toString('hex').substring(0, 5);
      const salt = genSaltSync(SALT_ROUND);
      const hash = hashSync(password, salt);
      await prisma.user.update({
        data: { password: hash },
        where: { id: user.id },
      });
      feedback = new Feedback(true, 'success');
      feedback.result = password;
    } else {
      feedback = new Feedback(false, 'User record not found');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getLevels = async () => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.level.findMany();
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};
