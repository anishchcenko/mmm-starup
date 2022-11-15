import { ApiProperty } from "@nestjs/swagger";
import { TransactionsIncome } from "@transactions/transactions-income.model";
import { TransactionResponseDto } from "./transaction-response.dto";

export class BalanceDto {

  @ApiProperty({example: 9, description: 'How much the user has invested'})
  readonly my_invest_count?: number;

  @ApiProperty({example: 4500, description: 'Total investment'})
  readonly invest_sum: number;

  @ApiProperty({example: 1616, description: 'How much did the user earn from his investment'})
  readonly profit_my_invest: number;

  @ApiProperty({example: 180, description: 'How much did the users referrals earn'})
  readonly my_ref_found: number;

  @ApiProperty({example: 18, description: 'How much did the user earn from his referrals'})
  readonly my_profit_ref: number;

  @ApiProperty({example: 1633, description: 'Total profit (own + referrals)'})
  readonly total_profit: number;

  @ApiProperty({example: [], description: 'id referrence user'})
  readonly invests?: Array<TransactionsIncome>;
}