import { ApiProperty } from "@nestjs/swagger";

export class TransactionDto {

  @ApiProperty({ example: 9009, description: 'Value' })
  readonly value: number;

  @ApiProperty({ example: 'US Dollar', description: 'currency' })
  readonly currency: string;

  @ApiProperty({ example: 1, description: 'user Id' })
  readonly userId?: number;

}
