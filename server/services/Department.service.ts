import Activity from 'server/models/Activity.model';
import Department, {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  UpdateDepartmentRequest,
} from 'server/models/Department.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import User from 'server/models/User.model';

export const createDepartment = async (
  request: CreateDepartmentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const departmentExists = await Department.findOne({
      where: { name: request.name },
    });

    if (!departmentExists) {
      feedback = new Feedback(true, 'success');
      const newDepartment = await Department.create({
        name: request.name,
      });
      feedback.result = newDepartment;
      // Track Activity
      await Activity.create({
        userId: user.id,
        content: `created new department '${newDepartment.name}'`,
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
    feedback.result = await Department.findOne({ where: { id } });
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
    let filter: any = {};
    if (search && search !== 'undefined') {
      filter.name = { contains: search };
    }
    let totalPages = await Department.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    if (paginate) {
      query.offset = pagination.skip;
      query.limit = pagination.take;
    }
    query.where = filter;
    feedback = new Feedback(true, 'success');
    feedback.results = await Department.findAll(query);
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

const findDepartmentBy = async (query: any) => {
  const department = await Department.findOne({ where: query });
  if (!department) {
    throw new Error('Not found');
  }

  return department;
};

export const updateDepartment = async (
  request: UpdateDepartmentRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const department = await findDepartmentBy({ id: Number(request.id) });
    await department.update({ name: request.name });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `updated department '${department.name} record'`,
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
    const department = await findDepartmentBy({ id: Number(request.id) });
    await department.destroy();
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `deleted department '${department.name} record'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
