import {
  ForeignKey,
  Table,
  Column,
  BelongsTo,
  HasMany,
  Model,
  DataType,
} from 'sequelize-typescript';
import User from './User.model';
import { Optional } from 'sequelize';
import Course from './Course.model';
import Department from './Department.model';

export class CreateTeacherRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string,
    public deptId: number
  ) {}
}

export class UpdateTeacherRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public levelId?: any,
    public deptId?: any,
    public password?: string
  ) {}
}

export class DeleteTeacherRequest {
  constructor(public id: number) {}
}

export interface TeacherAttributes {
  id: number;
  userId: number;
  user: User;
  deptId: number;
  department: Department;
  courses: Course[];
}

export interface TeacherCreationAttributes
  extends Optional<
    TeacherAttributes,
    'id' | 'department' | 'courses' | 'user'
  > {}

@Table
export default class Teacher extends Model<
  TeacherAttributes,
  TeacherCreationAttributes
> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Department)
  @Column(DataType.INTEGER)
  deptId!: number;

  @BelongsTo(() => Department)
  department!: Department;

  @HasMany(() => Course)
  courses!: Course[];
}
