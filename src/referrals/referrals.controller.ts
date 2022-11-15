import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReferralsService } from './referrals.service';

import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { CreateRefDto } from './dto/create-ref.dto';
import { ResponseRefDto } from './dto/response-ref.dto ';
import { Referrals } from './referrals.model';
import { GenRefDto } from './dto/gen-ref.dto';
import { InvestorAuthGuard } from '@auth/guards/investor.guard';

@ApiTags('Referrals')
@Controller('referrals')
export class ReferralsController {

  constructor(
    private referralsService: ReferralsService
  ) { }

  @UseGuards(InvestorAuthGuard)
  @ApiOperation({ summary: 'Get all Ref users' })
  @ApiResponse({ status: 200, type: [Referrals] })
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @Get()
  getAll(@Request() req) {
    return this.referralsService.getAllMyReferrals(req.user)
  }

  // @ApiOperation({ summary: 'Gen link to invite new user by email' })
  // @Post('/gen-link/:id')
  // genReferralLink(@Param('id') id): string {
  //   // console.log(id);
  //   return `This action returns a #${id} cat`;
  // }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Gen link to invite new user by email' })
  @ApiResponse({ status: 200, type: ResponseRefDto })
  @Post('/gen-link')
  genReferralLink(@Request() req, @Body() genLinkDto: GenRefDto) {
    return this.referralsService.genReferralLink(req.user, genLinkDto)
  }

}
