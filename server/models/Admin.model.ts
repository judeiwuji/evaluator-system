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

export class CreateAdminRequest {
  public type?: string;
  constructor(
    public surname: string,
    public othernames: string,
    public email: string,
    public password: string
  ) {}
}

export class UpdateAdminRequest {
  constructor(
    public id: number,
    public surname?: string,
    public othernames?: string,
    public email?: string,
    public password?: string
  ) {}
}

export class DeleteAdminRequest {
  constructor(public id: number) {}
}

export interface AdminAttributes {
  id: number;
  userId: number;
  user: User;
}

export interface AdminCreationAttributes
  extends Optional<AdminAttributes, 'id' | 'user'> {}

@Table
export default class Admin extends Model<
  AdminAttributes,
  AdminCreationAttributes
> {
  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
