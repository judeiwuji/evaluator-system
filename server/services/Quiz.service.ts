import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import Quiz, {
  CreateQuizRequest,
  DeleteQuizRequest,
  UpdateQuizRequest,
  ValidateQuizTokenRequest,
} from 'server/models/Quiz.model';
import * as crypto from 'crypto';
import { signToken } from 'server/utils/jwt.util';
import User from 'server/models/User.model';
import Activity from 'server/models/Activity.model';
import Course from 'server/models/Course.model';
import Topic from 'server/models/Topic.model';
import Teacher from 'server/models/Teacher.model';
import Question from 'server/models/Question.model';
import Answer from 'server/models/Answer.model';
import DB from 'server/models/engine/DBStorage';
import Student from 'server/models/Student.model';
import UserDTO from 'server/models/DTOs/UserDTO';
import { Op } from 'sequelize';

export const createQuiz = async (request: CreateQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    const titleExists = await Quiz.findOne({
      where: {
        title: request.title,
      },
    });

    if (titleExists) {
      feedback = new Feedback(false, 'Quiz title already exists');
    } else {
      feedback = new Feedback(true, 'success');
      const newQuiz = await Quiz.create({
        title: request.title,
        token: crypto.randomBytes(6).toString('hex'),
        topicId: request.topicId,
      });

      feedback.result = newQuiz;

      // Track Activity
      await Activity.create({
        userId: user.id,
        content: `created quiz '${newQuiz.title}' record`,
      });
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

const findQuizBy = async (query: any) => {
  const quiz = await Quiz.findOne({
    where: query,
    include: [{ model: Topic, include: [Course] }],
  });

  if (!quiz) {
    throw new Error('Not found');
  }
  return quiz;
};

export const getQuiz = async (filter: any) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await findQuizBy(filter);
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
    let filter: any = {};
    if (topicId !== 0) filter.topicId = topicId;
    if (search && search !== 'undefined') {
      filter.title = { [Op.like]: `%${search}%` };
    }

    if (active) {
      filter.active = active;
    }

    let query: any = {
      where: filter,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: Topic,
          include: [
            { model: Course, include: [{ model: Teacher, include: [User] }] },
          ],
        },
      ],
    };

    feedback = new Feedback(true, 'success');
    if (paginate) {
      let totalPages = await Quiz.count({ where: filter });
      let pagination = new Pagination(page, 20, totalPages);
      query.offset = pagination.skip;
      query.limit = pagination.take;
      feedback.page = pagination.page;
      feedback.pages = pagination.totalPages;
    }

    feedback.results = await Quiz.findAll(query);
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuiz = async (request: UpdateQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    const quiz = await findQuizBy({ id: Number(request.id) });
    await quiz.update({
      title: request.title,
      active: request.active,
      token: request.token,
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `updated quiz (${request.id}) record`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuiz = async (request: DeleteQuizRequest, user: User) => {
  let feedback: Feedback;
  try {
    const quiz = await findQuizBy({ id: Number(request.id) });
    await quiz.destroy();
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `deleted quiz (${request.id}) record'`,
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

    const quizScore: number = await Question.aggregate('score', 'sum', {
      where: { quizId },
    });

    let gradeScore = 0;
    let gradePosition = 0;

    let results = await Promise.all(
      (
        await Answer.findAll({
          group: ['studentId'],
          attributes: [[DB.fn('sum', DB.col('score')), 'score'], 'studentId'],
          where: { quizId },
          order: [['score', 'desc']],
        })
      ).map(async (d) => {
        const student = await Student.findOne({
          where: { id: d.studentId },
          include: [{ model: User, attributes: UserDTO }],
        });
        const result = {
          score: d.score,
          totalScore: quizScore,
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
        await Answer.findAll({
          group: ['questionId', 'score'],
          attributes: [
            'questionId',
            'score',
            'studentId',
            [DB.fn('count', DB.col('studentId')), 'count'],
          ],
          where: { quizId, score: { [Op.gt]: 0 } },
          order: [['count', 'DESC']],
        })
      ).map(async (d) => {
        const answer = d.toJSON();
        const question = await Question.findOne({
          where: { id: answer.questionId },
        });

        return {
          question,
          count: answer.count as number,
        };
      })
    );

    const failureRate = await Promise.all(
      (
        await Answer.findAll({
          group: ['questionId', 'score'],
          attributes: [
            'questionId',
            'score',
            [DB.fn('count', DB.col('studentId')), 'count'],
          ],
          where: { quizId, score: { [Op.eq]: 0 } },
          order: [['count', 'DESC']],
        })
      ).map(async (d: any) => {
        const answer = d.toJSON();
        const question = await Question.findOne({
          where: { id: answer.questionId },
        });

        return {
          question,
          count: answer.count as number,
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
      addToDataset(d.question?.question as string, d.count as number, 0);
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
    const quiz = await Quiz.findOne({
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
