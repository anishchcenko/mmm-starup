import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {

  @ApiProperty({example: '22@fff.com', description: 'valid email address'})
  readonly email: string;

  @ApiProperty({example: 'dKsr&jdl3', description: 'valid password'})
  readonly password: string;

  @ApiProperty({example: 1, description: 'id referrence user'})
  readonly refToUser?: number;

  @ApiProperty({example: 'Guest', description: 'User role'})
  readonly role?: 'Guest' | 'Investor' | 'Owner';
}