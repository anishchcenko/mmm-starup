import { ApiProperty } from "@nestjs/swagger";
import { Model, Table, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";

import { TransactionsIncome } from "@transactions/transactions-income.model";
import { TransactionsOutcome } from "@transactions/transactions-outcome.model";
import { Referrals } from "src/referrals/referrals.model";
import { CreateUserDto } from "./dto/create-user.dto";

@Table({ tableName: `users` })

export class User extends Model<User, CreateUserDto> {
  @ApiProperty({ example: '1', description: 'unique id' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: '22@fff.com', description: 'valid email address' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @ApiProperty({ example: 'Guest', description: 'Member role' })
  @Column({ type: DataType.STRING, allowNull: true })
  role: string;

  @ApiProperty({ example: '1', description: 'unique referred user id' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  refToUser: number;

  @ApiProperty({ example: 5, description: 'How mach user makes invesments' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  income_count: number;

  @ApiProperty({ example: [], description: 'Income payments array' })
  @HasMany(() => TransactionsIncome)
  incomes: TransactionsIncome[];

  @ApiProperty({ example: 5, description: 'How mach user makes withdraw' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  outcome_count: number;

  @ApiProperty({ example: [], description: 'Out payments array' })
  @HasMany(() => TransactionsOutcome)
  outcomes: TransactionsIncome[];

  @ApiProperty({ example: 5, description: 'How mach user have referrals' })
  @Column({ type: DataType.INTEGER, allowNull: true })
  referrals_count: number;

  @ApiProperty({ example: [], description: 'Referrals array' })
  @HasMany(() => Referrals)
  referrals: Referrals[];

}  