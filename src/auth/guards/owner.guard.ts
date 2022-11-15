import { ExecutionContext, Injectable, UnauthorizedException, CanActivate } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common/enums";
import { HttpException } from "@nestjs/common/exceptions";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class OwnerAuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const userHeader = req.headers.authorization;
      const tokenType = userHeader.split(' ')[0]
      const token = userHeader.split(' ')[1];
      if (tokenType !== 'Bearer' || !token) {
        throw new UnauthorizedException('User not authorized')
      }
      const user = this.jwtService.verify(token);
      req.user = user
      if (user.role != 'Owner') {
        return false
      }
      return true
    } catch (e) {
      // console.log(e , 'error')
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
    }
  }
}