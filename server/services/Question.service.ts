import { Op } from 'sequelize';
import Activity from 'server/models/Activity.model';
import Answer from 'server/models/Answer.model';
import { UserType } from 'server/models/Enums';
import { Feedback } from 'server/models/Feedback.model';
import Option, { OptionCreationAttributes } from 'server/models/Option';
import Pagination from 'server/models/Pagination.model';
import Question, {
  CreateQuestionOptionRequest,
  CreateQuestionRequest,
  DeleteQuestionOptionRequest,
  DeleteQuestionRequest,
  ProcessQuestionUploadRequest,
  UpdateQuestionOptionRequest,
  UpdateQuestionRequest,
  UploadQuestionRequest,
} from 'server/models/Question.model';
import Student from 'server/models/Student.model';
import User from 'server/models/User.model';
import DB from 'server/models/engine/DBStorage';
import { xlsxReader } from 'server/utils/xlsx.util';

export const createQuestion = async (request: CreateQuestionRequest) => {
  let feedback: Feedback;
  const transaction = await DB.transaction();

  try {
    feedback = new Feedback(true, 'success');
    const { id } = await Question.create(
      {
        question: request.question,
        answer: request.answer,
        timeout: request.timeout,
        score: request.score,
        quizId: request.quizId,
      },
      { transaction }
    );

    await Option.bulkCreate(
      request.options.map((d) => ({ option: d, questionId: id })),
      { transaction }
    );

    await transaction.commit();
    feedback.result = await Question.findByPk(id, {
      include: [Option],
    });
  } catch (error) {
    await transaction.rollback();
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

const findQuestionBy = async (query: any) => {
  const question = await Question.findOne({ where: query });

  if (!question) {
    throw new Error('Not found');
  }
  return question;
};

export const getQuestion = async (id: number) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    feedback.result = await findQuestionBy({ id });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
    console.log(error);
  }
  return feedback;
};

export const getQuestions = async (
  page = 1,
  quizId: number,
  user: User & { student: Student },
  search?: string,
  paginate = true,
  time = 0
) => {
  let feedback: Feedback;
  try {
    let filter: any = { quizId };
    if (search && search !== 'undefined') {
      filter.question = { [Op.like]: `%${search}%` };
    }

    if (time > 0) {
      let date = new Date(time);
      filter.createdAt = { [Op.gte]: date };
    }

    const query: any = {
      where: filter,
      order: [['createdAt', 'desc']],
      include: [{ model: Option }],
    };

    feedback = new Feedback(true, 'success');
    if (paginate) {
      let totalPages = await Question.count({ where: filter });
      let pagination = new Pagination(page, 20, totalPages);
      query.offset = pagination.skip;
      query.limit = pagination.take;
      feedback.page = pagination.page;
      feedback.pages = pagination.totalPages;
    }

    let questions: any[] = [];
    if (user.type === UserType.Student && time === 0) {
      questions = (
        await Promise.all(
          (
            await Question.findAll(query)
          ).map(async (d) => {
            const answer = await Answer.findOne({
              where: { questionId: d.id, studentId: user.student.id },
            });
            return answer === null ? d : null;
          })
        )
      ).filter((d) => d !== null);
      console.log(JSON.stringify(questions, null, 2));
    } else {
      questions = await Question.findAll(query);
    }
    feedback.results = questions;
  } catch (error) {
    console.log(error);
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuestion = async (request: UpdateQuestionRequest) => {
  let feedback: Feedback;
  try {
    const question = await findQuestionBy({ id: Number(request.id) });
    await question.update({
      question: request.question,
      answer: request.answer,
      timeout: request.timeout,
      score: request.score,
    });
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuestion = async (request: DeleteQuestionRequest) => {
  let feedback: Feedback;
  try {
    const question = await findQuestionBy({ id: Number(request.id) });
    await question.destroy();
    feedback = new Feedback(true, 'success');
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const createQuestionOption = async (
  request: CreateQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    feedback = new Feedback(true, 'success');
    const newQuestion = await Option.create({
      option: request.option,
      questionId: request.questionId,
    });
    feedback.result = newQuestion;
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `added new option to question'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const updateQuestionOption = async (
  request: UpdateQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    const updated = await Option.update(
      {
        option: request.option,
      },
      {
        where: { id: Number(request.id) },
      }
    );
    feedback = new Feedback(true, 'success');

    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `updated question (${request.id}) option record'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const deleteQuestionOption = async (
  request: DeleteQuestionOptionRequest,
  user: User
) => {
  let feedback: Feedback;
  try {
    await Option.destroy({
      where: { id: Number(request.id) },
    });
    feedback = new Feedback(true, 'success');
    // Track Activity
    await Activity.create({
      userId: user.id,
      content: `deleted question (${request.id}) option record'`,
    });
  } catch (error) {
    feedback = new Feedback(false, 'Operation failed');
  }
  return feedback;
};

export const processQuestionUpload = async (
  request: ProcessQuestionUploadRequest
) => {
  const rawData: UploadQuestionRequest[] = xlsxReader(request.filename)[
    'Sheet1'
  ];
  const feedback = new Feedback(true, 'success');
  feedback.errors = [];

  await Promise.all(
    rawData.map(async (d) => {
      const transaction = await DB.transaction();
      try {
        const alreadyExists = await Question.findOne({
          where: { quizId: Number(request.quizId), question: d.Question },
          transaction,
        });

        if (alreadyExists) {
          feedback.success = false;
          feedback.message = `Some questions where not inserted.`;
          feedback.errors?.push(
            `Failed to add "${d.Question}" because it already exists.`
          );
        } else {
          const { id } = await Question.create(
            {
              question: d.Question,
              answer: `${d.Answer}`,
              score: d.Score,
              timeout: d.Timeout,
              quizId: Number(request.quizId),
            },
            { transaction }
          );

          const options: OptionCreationAttributes[] = [];
          d.OptionA !== undefined
            ? options.push({ option: `${d.OptionA}`, questionId: id })
            : null;
          d.OptionB !== undefined
            ? options.push({ option: `${d.OptionB}`, questionId: id })
            : null;
          d.OptionC !== undefined
            ? options.push({ option: `${d.OptionC}`, questionId: id })
            : null;
          d.OptionD !== undefined
            ? options.push({ option: `${d.OptionD}`, questionId: id })
            : null;

          await Option.bulkCreate(options, { transaction });
        }
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        console.log(error);
        feedback.success = false;
        feedback.message = 'Operation failed';
        feedback.errors?.push(`Failed to add "${d.Question}".`);
      }
    })
  );
  return feedback;
};
