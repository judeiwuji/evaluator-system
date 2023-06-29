import { Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import Course from './Course.model';

export class CreateTopicRequest {
  constructor(
    public title: string,
    public description: string,
    public courseId: number
  ) {}
}

export class UpdateTopicRequest {
  constructor(
    public id: number,
    public courseId?: number,
    public title?: string,
    public description?: string
  ) {}
}

export class DeleteTopicRequest {
  constructor(public id: number) {}
}

export interface TopicAttributes {
  id: number;
  title: string;
  description: string;
  courseId: number;
  course: Course;
}

export interface TopicCreationAttributes
  extends Optional<TopicAttributes, 'id' | 'course'> {}

@Table
export default class Topic extends Model<
  TopicAttributes,
  TopicCreationAttributes
> {
  @Column(DataType.STRING(150))
  title!: string;

  @Column(DataType.STRING(300))
  description!: string;

  @ForeignKey(() => Course)
  @Column(DataType.INTEGER)
  courseId!: number;

  @BelongsTo(() => Course)
  course!: Course;
}
