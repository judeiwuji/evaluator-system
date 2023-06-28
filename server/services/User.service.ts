import { PrismaClient, User } from '@prisma/client';
import { Feedback } from 'server/models/Feedback.model';
import {
  DeleteUserActivityRequest,
  UpdateUserRequest,
} from 'server/models/User.model';
import prisma from '../utils/prisma.util';

export const getUser = async (filter: any) => {
  let user: any | null;
  try {
    user = await prisma.user.findFirst({
      where: filter,
      include: {
        student: { include: { department: true, level: true } },
        admin: true,
        teacher: { include: { department: true } },
      },
    });
  } catch (error) {
    console.log(error);
    user = null;
  }
  return user;
};

export const getUserActivities = async (userId: number, month: number) => {
  let feedback: Feedback;
  try {
    const year = new Date().getFullYear();
    const totalDays = new Date(year, month, 0).getDate();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month, totalDays);
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.activity.findMany({
      where: { userId, createdAt: { gte: startDate, lte: endDate } },
      include: {
        user: {
          select: { surname: true, othernames: true, avatar: true, type: true },
        },
      },
    });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateUser = async (request: UpdateUserRequest) => {
  let feedback: Feedback;
  try {
    await prisma.user.update({
      data: {
        surname: request.surname,
        othernames: request.othernames,
        avatar: request.avatar,
      },
      where: { id: request.id },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteUserActivity = async (
  request: DeleteUserActivityRequest
) => {
  let feedback: Feedback;
  try {
    await prisma.activity.delete({
      where: { id: request.id },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
