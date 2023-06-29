import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import Student, {
  CreateStudentRequest,
  DeleteStudentRequest,
  UpdateStudentRequest,
} from 'server/models/Student.model';
import User from 'server/models/User.model';
import DB from 'server/models/engine/DBStorage';
import Activity from 'server/models/Activity.model';
import UserDTO from 'server/models/DTOs/UserDTO';
import Department from 'server/models/Department.model';
import Level from 'server/models/Level.model';
import { Op } from 'sequelize';
import Answer from 'server/models/Answer.model';
import Question from 'server/models/Question.model';
import Quiz from 'server/models/Quiz.model';
import Topic from 'server/models/Topic.model';
import Course from 'server/models/Course.model';

const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createStudent = async (
  request: CreateStudentRequest,
  user: User
) => {
  let feedback: Feedback;
  const transaction = await DB.transaction();

  try {
    const emailExists = await User.findOne({
      where: { email: request.email },
      transaction,
    });

    const regNoExists = await Student.findOne({
      where: { regNo: request.regNo },
      transaction,
    });

    if (emailExists) {
      feedback = new Feedback(false, 'Email already exists.');
    } else if (regNoExists) {
      feedback = new Feedback(false, 'RegNo already exists.');
    } else {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);

      const newUser = await User.create(
        {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Student,
        },
        { transaction }
      );

      const userStudent = await Student.create(
        {
          userId: newUser.id,
          regNo: request.regNo,
          deptId: Number(request.deptId),
          levelId: Number(request.levelId),
        },
        { transaction }
      );

      await Activity.create({
        userId: user.id,
        content: `Added new student '${newUser.surname} ${newUser.othernames}' record'`,
      });
      await transaction.commit();
      feedback = new Feedback(true, 'success');
      const newStudent = await Student.findOne({
        where: { userId: newUser.id },
        include: [{ model: User, attributes: UserDTO }, Department, Level],
      });

      feedback.result = newStudent;
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

const findStudentBy = async (query: any) => {
  const user = await Student.findOne({
    where: query,
    include: [{ model: User, attributes: UserDTO }, Department, Level],
  });

  if (!user) {
    throw new Error('Not found');
  }
  return user;
};

export const getStudent = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await findStudentBy({ id });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getStudents = async (page: number, search?: string) => {
  let feedback: Feedback;
  try {
    let filter: any = {};
    let userFilter: any = {};

    if (search && search !== 'undefined') {
      // filter[Op.or] = [{ regNo: { [Op.like]: `${search}` } }];
      userFilter = {
        [Op.or]: [
          { surname: { [Op.like]: `%${search}%` } },
          { othernames: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    let totalPages = await Student.count({
      where: filter,
      include: [
        {
          model: User,
          attributes: UserDTO,
          order: [['surname', 'ASC']],
          where: userFilter,
        },
      ],
    });
    let pagination = new Pagination(page, 10, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await Student.findAll({
      where: filter,
      offset: pagination.skip,
      limit: pagination.take,
      include: [
        {
          model: User,
          attributes: UserDTO,
          order: [['surname', 'ASC']],
          where: userFilter,
        },
        Department,
        Level,
      ],
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
    const student = await findStudentBy({ id: request.id });

    await User.update(
      {
        surname: request.surname,
        othernames: request.othernames,
        password: hash,
      },
      { where: { id: student?.userId } }
    );

    await student.update({
      regNo: request.regNo,
      levelId: request.levelId,
      deptId: request.deptId,
    });

    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Updated student '${request.id}' record'`,
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
    const student = await findStudentBy({ id: Number(request.id) });
    feedback = new Feedback(true, 'success');

    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Deleted student '${request.id}' record'`,
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
    const result: { score: number } = await Answer.aggregate('score', 'sum', {
      where: { studentId, quizId },
    });
    const quizScore: { score: number } = await Question.aggregate(
      'score',
      'sum',
      {
        where: { quizId },
      }
    );

    const student = await findStudentBy({ id: studentId });
    feedback.result = {
      score: result.score,
      totalScore: quizScore.score,
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
        await Answer.findAll({
          group: ['studentId', 'quizId'],
          attributes: [[DB.fn('sum', DB.col('score')), 'score']],
          where: { studentId },
        })
      ).map(async (d) => {
        const quizScore: { score: number } = await Question.aggregate(
          'score',
          'sum',
          {
            where: { quizId: d.quizId },
          }
        );

        const quiz = await Quiz.findOne({
          where: { id: d.quizId },
          include: [{ model: Topic, include: [Course] }],
        });

        return {
          score: d.score,
          totalScore: quizScore.score,
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
