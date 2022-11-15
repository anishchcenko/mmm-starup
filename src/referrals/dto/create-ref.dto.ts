import { ApiProperty } from "@nestjs/swagger";

export class CreateRefDto {

  readonly id?: number

  @ApiProperty({example: '22@fff.com', description: 'valid email address'})
  readonly email: string;

  @ApiProperty({example: 'dKsr&jdl3', description: 'Hashed email address'})
  readonly hashValue: string;

  @ApiProperty({example: 1, description: 'Id invited person'})
  readonly invitedById: number;


  @ApiProperty({example: true, description: 'is invited user has been registered'})
  readonly isJoined: boolean;
}