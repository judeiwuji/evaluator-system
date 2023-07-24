import Admin, {
  CreateAdminRequest,
  DeleteAdminRequest,
  UpdateAdminRequest,
} from 'server/models/Admin.model';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import * as bcrypt from 'bcryptjs';
import Pagination from 'server/models/Pagination.model';
import User from 'server/models/User.model';
import DB from 'server/models/engine/DBStorage';
import UserDTO from 'server/models/DTOs/UserDTO';
import Activity from 'server/models/Activity.model';
import Student from 'server/models/Student.model';
import Teacher from 'server/models/Teacher.model';
import Department from 'server/models/Department.model';
import { Op } from 'sequelize';

const SALT_ROUND = Number(process.env['SALT_ROUND']);

export const createAdmin = async (request: CreateAdminRequest, user?: User) => {
  let feedback: Feedback;
  const transaction = await DB.transaction();
  try {
    const emailExists = await User.findOne({
      where: { email: request.email },
      transaction,
    });
    if (!emailExists) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      const hash = bcrypt.hashSync(request.password, salt);
      const adminUser = await User.create(
        {
          surname: request.surname,
          othernames: request.othernames,
          email: request.email,
          password: hash,
          type: UserType.Admin,
        },
        { transaction }
      );
      const admin = await Admin.create(
        { userId: adminUser.id },
        { transaction }
      );
      // Track Activity
      if (user) {
        await Activity.create({
          userId: user.id,
          content: `created a new admin '${adminUser.surname} ${adminUser.othernames}'`,
        });
      }
      transaction.commit();

      feedback = new Feedback(true, 'success');
      const newAdmin = await Admin.findOne({
        where: { id: admin.id },
        include: [{ model: User, attributes: UserDTO }],
      });
      feedback.result = newAdmin;
    } else {
      feedback = new Feedback(false, 'email already exists.');
    }
  } catch (error) {
    transaction.rollback();
    console.log(error);
    feedback = new Feedback(false, 'Failed to create account');
  }
  return feedback;
};

export const getAdmin = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await Admin.findOne({
      where: { id },
      include: [{ model: User, attributes: UserDTO }],
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
    let filter: any = {};
    if (search && search !== 'undefined') {
      filter = {
        [Op.or]: [
          { surname: { [Op.like]: `%${search}%` } },
          { othernames: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    let totalPages = await Admin.count({
      include: [{ model: User, where: filter }],
    });
    let pagination = new Pagination(page, 10, totalPages);

    feedback = new Feedback(true, 'success');
    feedback.results = await Admin.findAll({
      offset: pagination.skip,
      limit: pagination.take,
      include: [
        {
          model: User,
          attributes: UserDTO,
          order: [['surname', 'ASC']],
          where: filter,
        },
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

export const updateAdmin = async (request: UpdateAdminRequest, user: User) => {
  let feedback: Feedback;
  try {
    let hash: string | undefined;
    if (request.password) {
      const salt = bcrypt.genSaltSync(SALT_ROUND);
      hash = bcrypt.hashSync(request.password, salt);
    }

    const admin = await Admin.findByPk(request.id, { include: [User] });
    if (!admin) {
      throw new Error('Not found');
    }

    await admin.user.update({
      surname: request.surname,
      othernames: request.othernames,
      email: request.email,
      password: hash,
    });

    feedback = new Feedback(true, 'success');
    const updated = await Admin.findOne({
      where: { id: Number(request.id) },
      include: [{ model: User, attributes: UserDTO }],
    });
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `updated a admin '${updated?.user.surname} ${updated?.user.othernames}' record`,
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
    await Admin.destroy({
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');

    const admin = await Admin.findByPk(Number(request.id), {
      include: [User],
      paranoid: false,
    });
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `updated a admin '${admin?.user.surname} ${admin?.user.othernames}' record`,
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
    const admins = await Admin.count({});

    const students = await Student.count({});

    const teachers = await Teacher.count({});

    const departments = await Department.count({});

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

export const findAdminBy = async (query: any) => {
  const admin = await Admin.findOne({
    where: query,
    include: [{ model: User, attributes: UserDTO }],
  });

  if (!admin) {
    throw new Error('No record found');
  }

  return admin;
};

export const getAdminCount = async () => {
  return Admin.count({});
};
