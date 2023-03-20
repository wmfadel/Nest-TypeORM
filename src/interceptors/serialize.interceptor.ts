import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

// interface that matches with any class
interface ClassConstructor {
  new (...args: any[]): {};
}

// shortcut decorator for SerializeIntrceptor
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeIntrceptor(dto));
}

export class SerializeIntrceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler
    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        // Run something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
