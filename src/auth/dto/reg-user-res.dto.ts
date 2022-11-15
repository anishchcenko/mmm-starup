import { ApiProperty } from "@nestjs/swagger";

export class RegUserResponseDto {

  @ApiProperty({ example: 'dsfhllkdkdf.45454546sdf45.kj454lk', description: 'Bearer JWT token' })
  readonly token: string;
}