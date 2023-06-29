import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  HasOne,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import Admin from './Admin.model';
import Teacher from './Teacher.model';
import Student from './Student.model';

export class UpdateUserRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public avatar?: string
  ) {}
}

export class DeleteUserActivityRequest {
  constructor(public id: number) {}
}

export class UploadAvatarRequest {
  public filepath: string;
  constructor(public filename: string, userId: number) {
    this.filepath =
      process.env['NODE_ENV'] === 'production'
        ? filename
        : `/images/${filename}`;
  }
}

export interface UserAttributes {
  id: number;
  surname: string;
  othernames: string;
  email: string;
  password: string;
  type: string;
  avatar: string;
  admin: Admin;
  teacher: Teacher;
  student: Student;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    'id' | 'admin' | 'teacher' | 'student' | 'avatar'
  > {}

@Table
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
> {
  @Column(DataType.STRING(20))
  surname!: string;

  @Column(DataType.STRING(40))
  othernames!: string;

  @Unique
  @Column(DataType.STRING(60))
  email!: string;

  @Column(DataType.CHAR(60))
  password!: string;

  @Column(DataType.STRING(10))
  type!: string;

  @Column({
    type: DataType.STRING(300),
    defaultValue: './assets/imgs/avatar.png',
  })
  avatar!: string;

  @HasOne(() => Admin)
  admin?: Admin;

  @HasOne(() => Student)
  student?: Student;

  @HasOne(() => Teacher)
  teacher?: Teacher;
}
