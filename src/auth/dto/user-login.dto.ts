import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {

  @ApiProperty({example: '22@fff.com', description: 'valid email address'})
  readonly email: string;

  @ApiProperty({example: 'dKsr@jdl3.com', description: 'valid password'})
  readonly password: string;
}