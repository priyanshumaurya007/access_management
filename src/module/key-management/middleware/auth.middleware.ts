import { Injectable, UnauthorizedException, ExecutionContext, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, _: Response, next: () => void) {
    let token = req.headers['authorization'];
    token = token?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }


    try {
      const decoded = this.jwtService.verify(token);
      req['user'] = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
