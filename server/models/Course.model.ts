import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import Teacher from './Teacher.model';
import Topic from './Topic.model';
import { Optional } from 'sequelize';

export class CreateCourseRequest {
  constructor(
    public code: string,
    public title: string,
    public teacherId: number
  ) {}
}

export class UpdateCourseRequest {
  constructor(
    public id: number,
    public teacherId: number,
    public code?: string,
    public title?: string
  ) {}
}

export class DeleteCourseRequest {
  constructor(public id: number) {}
}

export interface CourseAttributes {
  id: number;
  code: string;
  title: string;
  teacherId: number;
  teacher: Teacher;
  topics: Topic[];
}

export interface CourseCreationAttributes
  extends Optional<CourseAttributes, 'id' | 'teacher' | 'topics'> {}

@Table
export default class Course extends Model<
  CourseAttributes,
  CourseCreationAttributes
> {
  @Unique
  @Column(DataType.STRING(10))
  code!: string;

  @Column(DataType.STRING(150))
  title!: string;

  @ForeignKey(() => Teacher)
  @Column(DataType.INTEGER)
  teacherId!: number;

  @BelongsTo(() => Teacher)
  teacher!: Teacher;

  @HasMany(() => Topic)
  topics!: Topic[];
}
