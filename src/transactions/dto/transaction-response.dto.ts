import { ApiProperty } from "@nestjs/swagger";

export class TransactionResponseDto {

  @ApiProperty({ example: 9009, description: 'Value' })
  readonly id: number;

  @ApiProperty({ example: 9009, description: 'Value' })
  readonly value: number;

  @ApiProperty({ example: 'US Dollar', description: 'currency' })
  readonly currency: string;

  @ApiProperty({ example: 1, description: 'user Id' })
  readonly userId: number;

  @ApiProperty({ example: "2022-11-15T11:20:11.358Z" })
  readonly createdAt: string;

}
