import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Student from './Student.model';
import { Optional } from 'sequelize';
import Question from './Question.model';
import Quiz from './Quiz.model';

export class CreateAnswerRequest {
  constructor(
    public studentId: number,
    public questionId: number,
    public quizId: number,
    public answer: string
  ) {}
}

export class StudentViewQuizResultRequest {
  constructor(public studentId: number, public quizId: number) {}
}

export class StudentViewQuizzesResultRequest {
  constructor(public studentId: number) {}
}

export class QuizViewResultsRequest {
  constructor(public quizId: number) {}
}

export class QuizGenerateReportRequest {
  constructor(public quizId: number) {}
}

export interface AnswerAttributes {
  id: number;
  questionId: number;
  question: Question;
  studentId: number;
  student: Student;
  quizId: number;
  quiz: Quiz;
  answer: string;
  score: number;
  count?: number;
}

export interface AnswerCreationAttributes
  extends Optional<AnswerAttributes, 'id' | 'question' | 'student' | 'quiz'> {}

@Table
export default class Answer extends Model<
  AnswerAttributes,
  AnswerCreationAttributes
> {
  @ForeignKey(() => Question)
  @Column(DataType.INTEGER)
  questionId!: number;

  @BelongsTo(() => Question)
  question!: Question;

  @ForeignKey(() => Student)
  @Column(DataType.INTEGER)
  studentId!: number;

  @BelongsTo(() => Student)
  student!: Student;

  @ForeignKey(() => Quiz)
  @Column(DataType.INTEGER)
  quizId!: number;

  @BelongsTo(() => Quiz)
  quiz!: Quiz;

  @Column(DataType.STRING)
  answer!: string;

  @Column(DataType.INTEGER)
  score!: number;
}
