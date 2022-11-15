import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ReferralsModule } from 'src/referrals/referrals.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() =>UsersModule),
    forwardRef(() =>ReferralsModule),
    JwtModule.register({
      secret: process.env.PRIVET_KEY || 'SomeKEy',
      signOptions: {
        expiresIn: '24h'
      }
    })  
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
