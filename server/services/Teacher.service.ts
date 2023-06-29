import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import Teacher, {
  CreateTeacherRequest,
  DeleteTeacherRequest,
  UpdateTeacherRequest,
} from 'server/models/Teacher.model';
import User from 'server/models/User.model';
import DB from 'server/models/engine/DBStorage';
import Activity from 'server/models/Activity.model';
import { Op } from 'sequelize';
import UserDTO from 'server/models/DTOs/UserDTO';
import Department from 'server/models/Department.model';
import Student from 'server/models/Student.model';
import Course from 'server/models/Course.model';

const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createTeacher = async (
  request: CreateTeacherRequest,
  user: User
) => {
  let feedback: Feedback;
  const transaction = await DB.transaction();
  try {
    const emailExists = await User.findOne({
      where: { email: request.email },
      transaction,
    });

    if (emailExists) {
      feedback = new Feedback(false, 'Email already exists.');
    } else {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const userTeacher = await User.create(
        {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Teacher,
        },
        { transaction }
      );

      await Activity.create(
        {
          userId: user.id,
          content: `Added new teacher '${userTeacher.surname} ${userTeacher.othernames}' record`,
        },
        {
          transaction,
        }
      );

      await Teacher.create(
        {
          deptId: Number(request.deptId),
          userId: userTeacher.id,
        },
        { transaction }
      );

      await transaction.commit();
      feedback = new Feedback(true, 'success');
      const newTeacher = await findTeacherBy({ userId: userTeacher.id });
      feedback.result = newTeacher;
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

const findTeacherBy = async (query: any) => {
  const user = await Teacher.findOne({
    where: query,
    include: [{ model: User, attributes: UserDTO }, Department],
  });

  if (!user) {
    throw new Error('Not found');
  }
  return user;
};

export const getTeacher = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await findTeacherBy({ id });
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const getTeachers = async (page: number, search?: string) => {
  let feedback: Feedback;
  console.log('Searching:: ' + search);

  try {
    let filter: any = {};
    let userFilter: any = {};

    if (search && search !== 'undefined') {
      userFilter = {
        [Op.or]: [
          { surname: { [Op.like]: `%${search}%` } },
          { othernames: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    let totalPages = await Teacher.count({
      where: filter,
      include: [{ model: User, where: userFilter }],
    });
    let pagination = new Pagination(page, 20, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await Teacher.findAll({
      where: filter,
      offset: pagination.skip,
      limit: pagination.take,
      include: [
        {
          model: User,
          attributes: UserDTO,
          where: userFilter,
          order: [['surname', 'ASC']],
        },
        Department,
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

export const updateTeacher = async (
  request: UpdateTeacherRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    let hash: string | undefined;
    if (request.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      hash = bcrypt.hashSync(request.password, salt);
    }

    request.deptId = request.deptId ? Number(request.deptId) : request.deptId;
    const teacher = await findTeacherBy({ id: request.id });

    await User.update(
      {
        surname: request.surname,
        othernames: request.othernames,
        password: hash,
      },
      { where: { id: teacher?.userId } }
    );

    await teacher.update({ deptId: request.deptId });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Updated teacher '${request.id}' record'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const deleteTeacher = async (
  request: DeleteTeacherRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const teacher = await findTeacherBy({ id: Number(request.id) });
    Teacher.destroy();
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Deleted teacher '${request.id}' record'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getTeacherDashboardStats = async () => {
  let feedback: Feedback;
  try {
    const students = await Student.count({});

    const courses = await Course.count({});
    feedback = new Feedback(true, 'success');
    feedback.result = {
      students,
      courses,
    };
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
