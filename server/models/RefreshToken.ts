import { Optional, UUIDV4 } from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import User from './User.model';

export interface RefreshTokenAttributes {
  id: string;
  token: string;
  userAgent: string;
  userId: number;
  user: User;
  valid: boolean;
}

export interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, 'id' | 'user' | 'valid'> {}

@Table
export default class RefreshToken extends Model<
  RefreshTokenAttributes,
  RefreshTokenCreationAttributes
> {
  @PrimaryKey
  @IsUUID('4')
  @Column({ type: DataType.STRING, defaultValue: UUIDV4() })
  override id!: string;

  @Column(DataType.TEXT('medium'))
  token!: string;

  @Column(DataType.TEXT)
  userAgent!: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  valid!: boolean;
}
