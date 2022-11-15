import { ApiProperty } from "@nestjs/swagger";
import { User } from "@users/users.model";
import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";

import { TransactionResponseDto } from "./dto/transaction-response.dto";

@Table({ tableName: `outcome`, updatedAt: false })

export class TransactionsOutcome extends Model<TransactionsOutcome, TransactionResponseDto> {

  @ApiProperty({ example: '1', description: 'unique id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number

  @ApiProperty({ example: 555, description: 'how much the investor withdraw from account' })
  @Column({ type: DataType.INTEGER })
  value: number;

  @ApiProperty({ example: 555, description: 'What currency used' })
  @Column({ type: DataType.STRING, allowNull: true })
  currency: string;

  // @ApiProperty({ example: 545 , description: 'userId' })
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @BelongsTo(() => User)
  user: User;

}  