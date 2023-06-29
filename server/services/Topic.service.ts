import { Op } from 'sequelize';
import Activity from 'server/models/Activity.model';
import { Feedback } from 'server/models/Feedback.model';
import Pagination from 'server/models/Pagination.model';
import Topic, {
  CreateTopicRequest,
  DeleteTopicRequest,
  UpdateTopicRequest,
} from 'server/models/Topic.model';
import User from 'server/models/User.model';

export const createTopic = async (request: CreateTopicRequest, user: User) => {
  let feedback: Feedback;
  try {
    const titleExists = await Topic.findOne({
      where: {
        title: request.title,
        courseId: request.courseId,
      },
    });

    if (titleExists) {
      feedback = new Feedback(false, 'Topic already exists in this course');
    } else {
      feedback = new Feedback(true, 'success');
      feedback.result = await Topic.create({
        title: request.title,
        description: request.description,
        courseId: request.courseId,
      });

      // Track Activity
      await Activity.create({
        userId: user.id,
        content: `Added new topic (${feedback.result.id}) record`,
      });
    }
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

const findTopicBy = async (query: any) => {
  const topic = await Topic.findOne({
    where: query,
  });

  if (!topic) {
    throw new Error('Not found');
  }
  return topic;
};

export const getTopic = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await findTopicBy({ id });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getTopics = async (
  page = 1,
  courseId: number,
  search?: string
) => {
  let feedback: Feedback;
  try {
    let filter: any = { courseId };
    if (search && search !== 'undefined') {
      filter.title = { [Op.like]: `%${search}%` };
    }
    let totalPages = await Topic.count({ where: filter });
    let pagination = new Pagination(page, 20, totalPages);
    feedback = new Feedback(true, 'success');
    feedback.results = await Topic.findAll({
      where: filter,
      offset: pagination.skip,
      limit: pagination.take,
      order: [['createdAt', 'desc']],
    });
    feedback.page = pagination.page;
    feedback.pages = pagination.totalPages;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateTopic = async (request: UpdateTopicRequest, user: User) => {
  let feedback: Feedback;
  try {
    await Topic.update(
      { title: request.title, description: request.description },
      {
        where: { id: Number(request.id) },
      }
    );
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Updated topic (${request.id}) record`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteTopic = async (request: DeleteTopicRequest, user: User) => {
  let feedback: Feedback;
  try {
    const topic = await findTopicBy({ id: Number(request.id) });
    await topic.destroy();
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `Deleted topic (${request.id}) record`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};
