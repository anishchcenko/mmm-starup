import { ApiProperty } from "@nestjs/swagger";

export class ResponseRefDto {

  @ApiProperty({example: 'http://localhost:7000/api/login/referral/sda345', description: 'Url for registration referalls'})
  readonly inviteURL: string;

}