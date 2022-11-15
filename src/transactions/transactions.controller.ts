import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { InvestorAuthGuard } from '@auth/guards/investor.guard';
import { TransactionsService } from './transactions.service';
import { OwnerAuthGuard } from '@auth/guards/owner.guard';
import { BalanceDto } from './dto/balance.dto';
import { BalanceOwnerDto } from './dto/balanceOwner.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {

  constructor(private transactionService: TransactionsService) { }

  @UseGuards(InvestorAuthGuard)
  @ApiOperation({ summary: 'View current user balance' })
  @ApiResponse({ status: 200, type: BalanceDto })
  @Get('/balance')
  getBalance(@Request() req) {
    return this.transactionService.getBalance(req.user)
  }

  @UseGuards(OwnerAuthGuard)
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @ApiOperation({ summary: 'View ROOT report for OWNER' })
  @ApiResponse({ status: 200, type: BalanceOwnerDto })
  @Get('/root-report')
  getOwnerBalance() {
    return this.transactionService.getOwnerBalance()
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new investment.' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @Post('/invest')
  makeIncomePay(@Request() req, @Body() payInfo: CreateTransactionDto) {
    return this.transactionService.createIncomePayment(req.user, payInfo)
  }

  @UseGuards(InvestorAuthGuard)
  @ApiOperation({ summary: 'Create new withdraw.' })
  @ApiResponse({ status: 200, type: TransactionResponseDto })
  @Post('/withdraw')
  makeOutcomePay(@Request() req, @Body() expectSum: CreateTransactionDto) {
    return this.transactionService.payUserAllowedProfit(req.user, expectSum)
  }

  @UseGuards(OwnerAuthGuard)
  // @UseGuards(InvestorAuthGuard)
  @ApiForbiddenResponse({ description: 'Forbidden.'})
  @ApiOperation({ summary: 'withdraw for OWNER' })
  @ApiResponse({ status: 200, type: BalanceOwnerDto })
  @Post('/withdraw-owner')
  getOwnerWithdraw(@Request() req) {
    return this.transactionService.ownerWithdrawAllMoney(req.user)
  }

}
