import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';


declare global {
    namespace Express {
        interface Request {
            currentUser?: any;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private useerService: UsersService) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.useerService.findOne(userId);
      req.currentUser = user;
    }
    next();
  }
}
