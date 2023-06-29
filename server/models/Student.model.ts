import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import User from './User.model';
import { Optional } from 'sequelize';
import Department from './Department.model';
import Level from './Level.model';

export class CreateStudentRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string,
    public regNo: string,
    public levelId: number,
    public deptId: number
  ) {}
}

export class UpdateStudentRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public password?: string,
    public regNo?: string,
    public levelId?: any,
    public deptId?: any
  ) {}
}

export class DeleteStudentRequest {
  constructor(public id: number) {}
}

export interface StudentAttributes {
  id: number;
  userId: number;
  user: User;
  regNo: string;
  levelId: number;
  level: Level;
  deptId: number;
  department: Department;
}

export interface StudentCreationAttributes
  extends Optional<StudentAttributes, 'id' | 'user' | 'department' | 'level'> {}

@Table
export default class Student extends Model<
  StudentAttributes,
  StudentCreationAttributes
> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column(DataType.STRING(100))
  regNo!: string;

  @ForeignKey(() => Level)
  @Column(DataType.INTEGER)
  levelId!: number;

  @BelongsTo(() => Level)
  level!: Level;

  @ForeignKey(() => Department)
  @Column(DataType.INTEGER)
  deptId!: number;

  @BelongsTo(() => Department)
  department!: Department;
}
