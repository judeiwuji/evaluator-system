import { PrismaClient, User } from '@prisma/client';
import {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  UpdateDepartmentRequest,
} from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import prisma from '../utils/prisma.util';

export const createDepartment = async (
  request: CreateDepartmentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const departmentExists = await prisma.department.findFirst({
      where: { name: request.name, deletedAt: { equals: null } },
    });

    if (!departmentExists) {
      feedback = new Feedback(true, 'success');
      const newDepartment = await prisma.department.create({
        data: { name: request.name, createdAt: new Date() },
      });
      feedback.result = newDepartment;
      // Track Activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          content: `created new department '${newDepartment.name}'`,
          createdAt: new Date(),
        },
      });
    } else {
      feedback = new Feedback(false, 'Department already exists');
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getDepartment = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.department.findFirst({ where: { id } });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getDepartments = async (
  page = 1,
  search?: string,
  paginate = true
) => {
  let feedback: Feedback;
  try {
    const query: any = {
      where: {},
      orderBy: { name: 'asc' },
    };
    let filter: any = { deletedAt: { equals: null } };
    if (search && search !== 'undefined') {
      filter.name = { contains: search };
    }
    let totalPages = await prisma.department.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    if (paginate) {
      query.skip = pagination.skip;
      query.take = pagination.take;
    }
    query.where = filter;
    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.department.findMany(query);
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateDepartment = async (
  request: UpdateDepartmentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const updated = await prisma.department.update({
      data: { name: request.name },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `updated department '${updated.name} record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteDepartment = async (
  request: DeleteDepartmentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const deleted = await prisma.department.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `deleted department '${deleted.name} record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
