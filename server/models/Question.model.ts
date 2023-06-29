import {
  DataType,
  Model,
  Column,
  ForeignKey,
  BelongsTo,
  HasMany,
  Table,
} from 'sequelize-typescript';
import Quiz from './Quiz.model';
import Option from './Option';
import { Optional } from 'sequelize';

export class CreateQuestionRequest {
  constructor(
    public question: string,
    public answer: string,
    public timeout: number,
    public score: number,
    public quizId: number,
    public options: string[]
  ) {}
}

export class UpdateQuestionRequest {
  constructor(
    public id: number,
    public question?: string,
    public answer?: string,
    public timeout?: number,
    public score?: number,
    public quizId?: number
  ) {}
}

export class DeleteQuestionRequest {
  constructor(public id: number) {}
}

export class CreateQuestionOptionRequest {
  constructor(public option: string, public questionId: number) {}
}

export class UpdateQuestionOptionRequest {
  constructor(public id: number, public option?: string) {}
}

export class DeleteQuestionOptionRequest {
  constructor(public id: number) {}
}

export class ProcessQuestionUploadRequest {
  constructor(public quizId: number, public filename: string) {}
}

export class UploadQuestionRequest {
  constructor(
    public Score: number,
    public Timeout: number,
    public Question: string,
    public Answer: string,
    public OptionA?: string,
    public OptionB?: string,
    public OptionC?: string,
    public OptionD?: string
  ) {}
}

export interface QuestionAttributes {
  id: number;
  question: string;
  answer: string;
  timeout: number;
  score: number;
  quizId: number;
  quiz: Quiz;
  options: Option[];
}

export interface QuestionCreationAttributes
  extends Optional<QuestionAttributes, 'id' | 'quiz' | 'options'> {}

@Table
export default class Question extends Model<
  QuestionAttributes,
  QuestionCreationAttributes
> {
  @Column(DataType.STRING(300))
  question!: string;

  @Column(DataType.STRING(300))
  answer!: string;

  @Column({ type: DataType.INTEGER, defaultValue: 30 })
  timeout!: number;

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  score!: number;

  @ForeignKey(() => Quiz)
  @Column(DataType.INTEGER)
  quizId!: number;

  @BelongsTo(() => Quiz)
  quiz!: Quiz;

  @HasMany(() => Option)
  options!: Option[];
}
