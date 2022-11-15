import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {

  @ApiProperty({ example: 9009, description: 'Value' })
  readonly value: number;
}
