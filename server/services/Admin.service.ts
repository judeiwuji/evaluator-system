import { PrismaClient, User } from '@prisma/client';
import {
  CreateAdminRequest,
  DeleteAdminRequest,
  UpdateAdminRequest,
} from 'server/models/Admin.model';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import prisma from '../utils/prisma.util';

const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createAdmin = async (request: CreateAdminRequest, user: User) => {
  let feedback: Feedback;
  try {
    const emailExists = await prisma.user.findFirst({
      where: { email: request.email },
    });
    if (!emailExists) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const admin = await prisma.user.create({
        data: {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Admin,
          createdAt: new Date(),
          admin: { create: {} },
        },
      });
      feedback = new Feedback(true, 'success');
      const newAdmin = await prisma.admin.findFirst({
        where: { userId: admin.id },
        select: {
          userId: true,
          user: {
            select: {
              surname: true,
              othernames: true,
              email: true,
              avatar: true,
              type: true,
            },
          },
        },
      });
      feedback.result = newAdmin;
      // Track Activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          content: `created a new admin '${newAdmin?.user.surname} ${newAdmin?.user.othernames}'`,
          createdAt: new Date(),
        },
      });
    } else {
      feedback = new Feedback(false, 'email already exists.');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

export const getAdmin = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.admin.findFirst({
      where: { id, user: { deletedAt: { equals: null } } },
      include: {
        user: {
          select: {
            surname: true,
            othernames: true,
            avatar: true,
            email: true,
            type: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getAdmins = async (page: number, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { user: { deletedAt: { equals: null } } };
    if (search && search !== 'undefined') {
      filter.user.surname = { contains: search };
      filter.user.othernames = { contains: search };
    }

    let totalPages = await prisma.admin.count({ where: filter });
    let pagination = new Pagination(page, 10, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.admin.findMany({
      where: filter,
      skip: pagination.skip,
      take: pagination.take,
      include: {
        user: {
          select: {
            surname: true,
            othernames: true,
            email: true,
            avatar: true,
            id: true,
            type: true,
          },
        },
      },
      orderBy: { user: { surname: 'asc' } },
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateAdmin = async (request: UpdateAdminRequest, user: User) => {
  let feedback: Feedback;
  try {
    let hash: string | undefined;
    if (request.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      hash = bcrypt.hashSync(request.password, salt);
    }

    await prisma.admin.update({
      data: {
        user: {
          update: {
            surname: request.surname,
            othernames: request.othernames,
            email: request.email,
            password: hash,
          },
        },
      },
      where: { id: Number(request.id) },
    });

    feedback = new Feedback(true, 'success');
    const updated = await prisma.admin.findFirst({
      where: { id: Number(request.id) },
      include: { user: true },
    });
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `updated a admin '${updated?.user.surname} ${updated?.user.othernames}' record`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const deleteAdmin = async (request: DeleteAdminRequest, user: User) => {
  let feedback: Feedback;
  try {
    await prisma.admin.update({
      data: { user: { update: { deletedAt: new Date() } } },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    const updated = await prisma.admin.findFirst({
      where: { id: Number(request.id) },
      include: { user: true },
    });
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `updated a admin '${updated?.user.surname} ${updated?.user.othernames}' record`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getAdminDashboardStats = async () => {
  let feedback: Feedback;
  try {
    const admins = await prisma.admin.count({
      where: { user: { deletedAt: { equals: null } } },
    });

    const students = await prisma.student.count({
      where: { user: { deletedAt: { equals: null } } },
    });

    const teachers = await prisma.student.count({
      where: { user: { deletedAt: { equals: null } } },
    });

    const departments = await prisma.department.count({
      where: { deletedAt: { equals: null } },
    });

    feedback = new Feedback(true, 'success');
    feedback.result = {
      admins,
      teachers,
      students,
      departments,
    };
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
