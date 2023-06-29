import { Optional } from 'sequelize';
import { DataType, Column, Table, Model } from 'sequelize-typescript';

export class CreateDepartmentRequest {
  constructor(public name: string) {}
}

export class UpdateDepartmentRequest {
  constructor(public id: number, public name: string) {}
}

export class DeleteDepartmentRequest {
  constructor(public id: number) {}
}

export interface DepartmentAttributes {
  id: number;
  name: string;
}

export interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, 'id'> {}

@Table
export default class Department extends Model<
  DepartmentAttributes,
  DepartmentCreationAttributes
> {
  @Column(DataType.STRING(150))
  name!: string;
}
