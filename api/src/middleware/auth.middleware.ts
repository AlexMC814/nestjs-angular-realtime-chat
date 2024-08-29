import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, Request, NextFunction } from 'express';
import { AuthService } from 'src/auth/services/auth/auth.service';
import { IUser } from 'src/user/model/user.interface';
import { UserService } from 'src/user/services/user-service/user.service';

export interface RequestModel extends Request {
  user: IUser;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);
      // make sure that the user is not deleted, or that props or rights changed
      // compared to the time when the jwt was issued
      const user: IUser = await this.userService.getOne(decodedToken.user.id);

      if (user) {
        //  add the user to the req object, to access it later when needed
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
