import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Question from './Question.model';
import { Optional } from 'sequelize';

export interface OptionAttributes {
  id: number;
  option: string;
  questionId: number;
  question: Question;
}

export interface OptionCreationAttributes
  extends Optional<OptionAttributes, 'id' | 'question'> {}

@Table
export default class Option extends Model<
  OptionAttributes,
  OptionCreationAttributes
> {
  @Column(DataType.STRING(300))
  option!: string;

  @ForeignKey(() => Question)
  @Column(DataType.INTEGER)
  questionId!: number;

  @BelongsTo(() => Question)
  question!: Question;
}
