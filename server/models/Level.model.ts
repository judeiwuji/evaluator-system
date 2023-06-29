import { Optional } from 'sequelize';
import { DataType, Table, Column, Model } from 'sequelize-typescript';

export interface LevelAttributes {
  id: number;
  name: string;
}

export interface LevelCreationAttributes
  extends Optional<LevelAttributes, 'id'> {}

@Table
export default class Level extends Model<
  LevelAttributes,
  LevelCreationAttributes
> {
  @Column(DataType.STRING(10))
  name!: string;
}
