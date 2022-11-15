import { ApiProperty } from "@nestjs/swagger";
import { CreateRefDto } from "src/referrals/dto/create-ref.dto";

export class RegReferralUserResponse {

  @ApiProperty({ example: CreateRefDto, description: 'User object' })
  readonly item: CreateRefDto;

  @ApiProperty({ example: 'dsfhllkdkdf.45454546sdf45.kj454lk', description: 'Bearer JWT token' })
  readonly tokenNewUser: string;

  @ApiProperty({ example: 'dsfhllkdk', description: 'User password' })
  readonly password: string;

  

      

}