import { ExecutionContext, Injectable, UnauthorizedException, CanActivate } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";


@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // console.log(req, 'req')
    try {
      const userHeader = req.headers.authorization;
      const tokenType = userHeader.split(' ')[0]
      const token = userHeader.split(' ')[1];
      if (tokenType !== 'Bearer' || !token) {
        throw new UnauthorizedException('User not authorized')
      }
      const user = this.jwtService.verify(token);
      req.user = user
      return true

    } catch (e){
      console.log(e , 'error')
      throw new UnauthorizedException('User not authorized')
    }
  }
}