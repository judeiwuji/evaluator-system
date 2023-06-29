import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import Topic from './Topic.model';
import Question from './Question.model';
import Answer from './Answer.model';
import { Optional } from 'sequelize';

export class CreateQuizRequest {
  constructor(
    public title: string,
    public token: string,
    public topicId: number
  ) {}
}

export class UpdateQuizRequest {
  constructor(
    public id: number,
    public title?: string,
    public token?: string,
    public active?: boolean,
    public topicId?: number
  ) {}
}

export class DeleteQuizRequest {
  constructor(public id: number) {}
}

export class ValidateQuizTokenRequest {
  constructor(public quizId: number, public token: string) {}
}

export interface QuizAttributes {
  id: number;
  token: string;
  title: string;
  active: boolean;
  topicId: number;
  topic: Topic;
}

export interface QuizCreationAttributes
  extends Optional<QuizAttributes, 'id' | 'topic' | 'active'> {}

@Table
export default class Quiz extends Model<
  QuizAttributes,
  QuizCreationAttributes
> {
  @Column(DataType.STRING(15))
  token!: string;

  @Column(DataType.STRING(300))
  title!: string;

  @Column(DataType.BOOLEAN)
  active!: boolean;

  @ForeignKey(() => Topic)
  @Column(DataType.INTEGER)
  topicId!: number;

  @BelongsTo(() => Topic)
  topic!: Topic;
}
