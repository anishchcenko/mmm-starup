import { ApiProperty } from "@nestjs/swagger";

export class GenRefDto {

  @ApiProperty({example: 'sdfsdfd@dsf.com', description: 'email your friend'})
  readonly email: string;

}