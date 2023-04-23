import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private useerService: UsersService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    console.log('session user ', userId);
    if (userId) {
      const user = await this.useerService.findOne(userId);
      if (user) {
        request.currentUser = user;
        console.log('added user ', request.currentUser);
      }
    }
    return next.handle();
  }
}