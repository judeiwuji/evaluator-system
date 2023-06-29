import { Op } from 'sequelize';
import Activity from 'server/models/Activity.model';
import Admin from 'server/models/Admin.model';
import UserDTO from 'server/models/DTOs/UserDTO';
import Department from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import Level from 'server/models/Level.model';
import Student from 'server/models/Student.model';
import Teacher from 'server/models/Teacher.model';
import User, {
  DeleteUserActivityRequest,
  UpdateUserRequest,
} from 'server/models/User.model';

export const getUser = async (filter: any) => {
  let user: any | null;
  try {
    user = await User.findOne({
      where: filter,
      include: [
        Admin,
        { model: Student, include: [Department, Level] },
        { model: Teacher, include: [Department] },
      ],
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
    feedback.results = await Activity.findAll({
      where: { userId, createdAt: { [Op.gte]: startDate, [Op.lte]: endDate } },
      include: [{ model: User, attributes: UserDTO }],
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
    await User.update(
      {
        surname: request.surname,
        othernames: request.othernames,
        avatar: request.avatar,
      },
      {
        where: { id: request.id },
      }
    );
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
    await Activity.destroy({
      where: { id: request.id },
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
