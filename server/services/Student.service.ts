import { PrismaClient, User } from '@prisma/client';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import {
  CreateStudentRequest,
  DeleteStudentRequest,
  UpdateStudentRequest,
} from 'server/models/Student.model';
import prisma from '../utils/prisma.util';

const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createStudent = async (
  request: CreateStudentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const emailExists = await prisma.user.findFirst({
      where: { email: request.email },
    });

    const regNoExists = await prisma.student.findFirst({
      where: { regNo: request.regNo },
    });

    if (emailExists) {
      feedback = new Feedback(false, 'Email already exists.');
    } else if (regNoExists) {
      feedback = new Feedback(false, 'RegNo already exists.');
    } else {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const student = await prisma.user.create({
        data: {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Student,
          createdAt: new Date(),
          student: {
            create: {
              regNo: request.regNo,
              deptId: Number(request.deptId),
              levelId: Number(request.levelId),
            },
          },
        },
      });

      feedback = new Feedback(true, 'success');
      const newStudent = await prisma.student.findFirst({
        where: { userId: student.id },
        include: {
          user: {
            select: {
              surname: true,
              othernames: true,
              email: true,
              avatar: true,
              type: true,
            },
          },
          department: true,
          level: true,
        },
      });

      feedback.result = newStudent;

      // Track Activity
      if (user) {
        await prisma.activity.create({
          data: {
            userId: user.id,
            content: `Added new student '${newStudent?.user.surname} ${newStudent?.user.othernames}' record'`,
            createdAt: new Date(),
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

export const getStudent = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.student.findFirst({
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
        department: true,
        level: true,
      },
    });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getStudents = async (page: number, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = { user: { deletedAt: { equals: null } } };
    if (search && search !== 'undefined') {
      filter.OR = [
        { regNo: { contains: search } },
        {
          user: {
            OR: [
              { surname: { contains: search } },
              { othernames: { contains: search } },
            ],
          },
        },
      ];
    }

    let totalPages = await prisma.student.count({
      where: filter,
    });
    let pagination = new Pagination(page, 10, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await prisma.student.findMany({
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
        department: true,
        level: true,
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

export const updateStudent = async (
  request: UpdateStudentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    let hash: string | undefined;
    if (request.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      hash = bcrypt.hashSync(request.password, salt);
    }

    request.levelId = request.levelId
      ? Number(request.levelId)
      : request.levelId;
    request.deptId = request.deptId ? Number(request.deptId) : request.deptId;
    const student = await prisma.student.findFirst({
      where: { id: request.id },
    });

    await prisma.user.update({
      data: {
        surname: request.surname,
        othernames: request.othernames,
        password: hash,
        student: {
          update: {
            regNo: request.regNo,
            levelId: request.levelId,
            deptId: request.deptId,
          },
        },
      },
      where: { id: student?.userId },
    });

    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `Updated student '${request.id}' record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const deleteStudent = async (
  request: DeleteStudentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    await prisma.student.update({
      data: { user: { update: { deletedAt: new Date() } } },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `Deleted student '${request.id}' record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

// Returns a student's quiz result
export const getStudentQuizResult = async (
  studentId: number,
  quizId: number
) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    const result = await prisma.answer.aggregate({
      _sum: { score: true },
      where: { studentId, quizId },
    });
    const quizScore = await prisma.question.aggregate({
      _sum: { score: true },
      where: { quizId },
    });
    const student = await prisma.student.findFirst({
      where: { id: studentId },
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
    feedback.result = {
      score: result._sum.score,
      totalScore: quizScore._sum.score,
      student,
    };
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

// Returns a student result on all quizzes taken
export const getStudentQuizzesResult = async (studentId: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    const results = await Promise.all(
      (
        await prisma.answer.groupBy({
          by: ['studentId', 'quizId'],
          _sum: { score: true },
          where: { studentId },
        })
      ).map(async (d) => {
        const quizScore = await prisma.question.aggregate({
          _sum: { score: true },
          where: { quizId: d.quizId },
        });

        const quiz = await prisma.quiz.findFirst({
          where: { id: d.quizId },
          include: { topic: { include: { course: true } } },
        });

        return {
          score: d._sum.score,
          totalScore: quizScore._sum.score,
          quiz,
        };
      })
    );

    feedback.results = results;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
