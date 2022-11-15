import { ApiProperty } from "@nestjs/swagger";
import { User } from "@users/users.model";
import { Model, Table, Column, DataType, BelongsToMany, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";

import { IReferrals } from "./interfaces/referrals.interface";

@Table({ tableName: `referrals`, updatedAt: false })

export class Referrals extends Model<Referrals, IReferrals> {
  @ApiProperty({ example: '1', description: 'unique id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ApiProperty({ example: '22@fff.com', description: 'valid email address invited user' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ForeignKey(() => User)
  @ApiProperty({ example: 1, description: ' id iser ' })
  @Column({ type: DataType.INTEGER, allowNull: false })
  invitedById: number;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbC2OTc1NiwiZXhwIjoxNjY4MzU2MTU2f', description: ' hashed value for invite url' })
  @Column({ type: DataType.STRING, allowNull: false })
  hashValue: string;

  @ApiProperty({ example: 1, description: ' id iser ' })
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  isJoined: boolean;

  @ApiProperty({ example: 1, description: ' id iser ' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}  