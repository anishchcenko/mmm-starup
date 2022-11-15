import { ApiProperty } from "@nestjs/swagger";
import { TransactionsIncome } from "@transactions/transactions-income.model";

export class BalanceOwnerDto {

  @ApiProperty({example: 584, description: 'Total count invests'})
  readonly income_count?: number;

  @ApiProperty({example: 4050500, description: 'Total sum investment'})
  readonly incomes: number;

  @ApiProperty({example: 24, description: 'Total count withdraw'})
  readonly outcome_count: number;

  @ApiProperty({example: 50500, description: 'Total sum withdraw'})
  readonly outcomes: number;

  @ApiProperty({example: 4000000, description: 'Moneq left'})
  readonly balance: number;

  @ApiProperty({example: 'US Dollars', description: 'currency'})
  readonly currency: string;

  // @ApiProperty({example: [], description: 'id referrence user'})
  // readonly invests?: Array<TransactionsIncome>;
}