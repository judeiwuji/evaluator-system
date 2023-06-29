import { Op } from 'sequelize';
import Activity from 'server/models/Activity.model';
import Course, {
  CreateCourseRequest,
  DeleteCourseRequest,
  UpdateCourseRequest,
} from 'server/models/Course.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import User from 'server/models/User.model';

export const createCourse = async (
  request: CreateCourseRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const courseCodeExists = await Course.findOne({
      where: { code: request.code, teacherId: request.teacherId },
    });

    const courseTitleExists = await Course.findOne({
      where: {
        title: request.title,
        teacherId: request.teacherId,
      },
    });

    if (courseCodeExists) {
      feedback = new Feedback(false, 'Course code already exists');
    } else if (courseTitleExists) {
      feedback = new Feedback(false, 'Course title already exists');
    } else {
      feedback = new Feedback(true, 'success');
      feedback.result = await Course.create({
        code: request.code,
        title: request.title,
        teacherId: request.teacherId,
      });
      // Track Activity
      await Activity.create({
        userId: user.id,
        content: `Added a new course '${request.title}'`,
      });
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getCourse = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await Course.findOne({ where: { id } });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getCourses = async (
  page = 1,
  search?: string,
  teacherId?: number
) => {
  let feedback: Feedback;
  try {
    let filter: any = {};
    if (search) {
      filter.title = { [Op.like]: `%${search}%` };
    }

    if (teacherId) {
      filter.teacherId = teacherId;
    }

    let totalPages = await Course.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await Course.findAll({
      where: filter,
      offset: pagination.skip,
      limit: pagination.take,
      order: [['code', 'asc']],
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateCourse = async (
  request: UpdateCourseRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const course = await Course.findByPk(Number(request.id));
    if (!course) {
      throw new Error('Not found');
    }

    const updated = await course.update({
      title: request.title,
      code: request.code,
    });
    feedback = new Feedback(true, 'success');

    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Updated a course '${updated.title}'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteCourse = async (
  request: DeleteCourseRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const course = await Course.findByPk(Number(request.id));
    if (!course) {
      throw new Error('Not found');
    }

    await course.destroy();
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `deleted a course '${course.title}'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
