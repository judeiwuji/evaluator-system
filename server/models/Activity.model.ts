import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import User from './User.model';
import { Optional } from 'sequelize';

export interface ActivityAttributes {
  id: number;
  content: string;
  userId: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface ActivityCreationAttributes
  extends Optional<
    ActivityAttributes,
    'id' | 'user' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

@Table
export default class Activity extends Model<
  ActivityAttributes,
  ActivityCreationAttributes
> {
  @Column(DataType.STRING(250))
  content!: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
