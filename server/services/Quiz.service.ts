import { PrismaClient, User } from '@prisma/client';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import {
  CreateQuizRequest,
  DeleteQuizRequest,
  UpdateQuizRequest,
  ValidateQuizTokenRequest,
} from 'server/models/Quiz.model';
import * as crypto from 'crypto';
import { signToken } from 'server/utils/jwt.util';
import prisma from '../utils/prisma.util';

export const createQuiz = async (request: CreateQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    const titleExists = await prisma.quiz.findFirst({
      where: {
        title: request.title,
        deletedAt: { equals: null },
      },
    });

    if (titleExists) {
      feedback = new Feedback(false, 'Quiz title already exists');
    } else {
      feedback = new Feedback(true, 'success');
      const newQuiz = await prisma.quiz.create({
        data: {
          title: request.title,
          token: crypto.randomBytes(6).toString('hex'),
          topicId: request.topicId,
          createdAt: new Date(),
        },
      });

      feedback.result = newQuiz;

      // Track Activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          content: `created quiz '${newQuiz.title}' record`,
          createdAt: new Date(),
        },
      });
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuiz = async (filter: any) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await prisma.quiz.findFirst({
      where: filter,
      include: { topic: { include: { course: true } } },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuizes = async (
  page = 1,
  topicId: number,
  search?: string,
  active = false,
  paginate = true,
  time = 0
) => {
  let feedback: Feedback;
  try {
    let filter: any = { deletedAt: { equals: null } };
    if (topicId !== 0) filter.topicId = topicId;
    if (search && search !== 'undefined') {
      filter.title = { contains: search };
    }

    if (active) {
      filter.active = active;
    }

    let query: any = {
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: {
        topic: {
          include: {
            course: { include: { teacher: { include: { user: true } } } },
          },
        },
      },
    };

    feedback = new Feedback(true, 'success');
    if (paginate) {
      let totalPages = await prisma.quiz.count({ where: filter });
      let pagination = new Pagination(page, 20, totalPages);
      query.skip = pagination.skip;
      query.take = pagination.take;
      feedback.page = pagination.page;
      feedback.pages = pagination.totalPages;
    }

    feedback.results = await prisma.quiz.findMany(query);
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuiz = async (request: UpdateQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    await prisma.quiz.update({
      data: {
        title: request.title,
        active: request.active,
        token: request.token,
      },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `updated quiz (${request.id}) record`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuiz = async (request: DeleteQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    await prisma.quiz.update({
      data: { deletedAt: new Date() },
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        content: `deleted quiz (${request.id}) record'`,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getQuizResults = async (quizId: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');

    const quizScore = await prisma.question.aggregate({
      _sum: { score: true },
      where: { quizId },
    });

    let gradeScore = 0;
    let gradePosition = 0;

    let results = await Promise.all(
      (
        await prisma.answer.groupBy({
          by: ['studentId'],
          _sum: { score: true },
          where: { quizId },
          orderBy: { _sum: { score: 'desc' } },
        })
      ).map(async (d) => {
        const student = await prisma.student.findFirst({
          where: { id: d.studentId },
          include: {
            user: {
              select: {
                surname: true,
                othernames: true,
                avatar: true,
              },
            },
          },
        });
        const result = {
          score: d._sum.score,
          totalScore: quizScore._sum.score,
          student,
          position: 0,
        };

        return result;
      })
    );

    // ranking
    results = results.map((d) => {
      gradePosition = gradeScore === d.score ? gradePosition : ++gradePosition;
      gradeScore = Number(d.score);

      return {
        ...d,
        position: gradePosition,
      };
    });

    feedback.results = results;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }

  return feedback;
};

export const generateQuizReport = async (quizId: number) => {
  let feedback: Feedback;
  try {
    const passRate = await Promise.all(
      (
        await prisma.answer.groupBy({
          by: ['questionId', 'score'],
          _count: { studentId: true },
          having: { score: { gt: 0 } },
          where: { quizId },
          orderBy: { _count: { studentId: 'desc' } },
        })
      ).map(async (d) => {
        const question = await prisma.question.findFirst({
          where: { id: d.questionId },
          select: { id: true, question: true },
        });

        return {
          question,
          count: d._count.studentId,
        };
      })
    );

    const failureRate = await Promise.all(
      (
        await prisma.answer.groupBy({
          by: ['questionId', 'score'],
          _count: { studentId: true },
          having: { score: { equals: 0 } },
          where: { quizId },
        })
      ).map(async (d) => {
        const question = await prisma.question.findFirst({
          where: { id: d.questionId },
          select: { id: true, question: true },
        });

        return {
          question,
          count: d._count.studentId,
        };
      })
    );
    const labels: string[] = [];
    const dataset: { label: string; data: number[] }[] = [
      { label: 'Pass', data: [] },
      { label: 'Fail', data: [] },
    ];

    const addToDataset = (question: string, count: number, index = 0) => {
      if (!labels.includes(question)) labels.push(question);
      dataset[index].data.push(count);
    };

    passRate.forEach((d) => {
      addToDataset(d.question?.question as string, d.count, 0);
      let found = false;
      for (let f of failureRate) {
        if (d.question?.id == f.question?.id) {
          found = true;
          addToDataset(f.question?.question as string, f.count, 1);
          break;
        }
      }
      // Empty data for failure
      if (!found) {
        addToDataset(d.question?.question as string, 0, 1);
      }
    });
    feedback = new Feedback(true, 'success');
    feedback.result = {
      labels,
      dataset,
    };
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const validateQuizToken = async (request: ValidateQuizTokenRequest) => {
  let feedback: Feedback;
  try {
    const quiz = await prisma.quiz.findFirst({
      where: { id: request.quizId, token: request.token },
    });
    if (quiz) {
      const token = signToken({ quiz: quiz.id }, '24h');
      feedback = new Feedback(true, 'success');
      feedback.result = token;
    } else {
      feedback = new Feedback(false, 'Invalid quiz token');
    }
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
