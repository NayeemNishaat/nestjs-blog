import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { ResponseBaseDTO } from "src/libs/core/dto/base.dto";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import ResponseConstants from "src/constants/response.constant";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseBaseDTO<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ResponseBaseDTO<T>> {
    return next.handle().pipe(
      map((data) => {
        const { statusCode } = context.switchToHttp().getResponse();
        const { message } = data;
        delete data.message;

        return {
          error: ResponseConstants.Common[statusCode]?.error || false,
          statusString:
            ResponseConstants.Common[statusCode]?.statusString || "OK",
          statusCode: ResponseConstants.Common[statusCode]?.statusCode || 200,
          message:
            message ||
            ResponseConstants.Common[statusCode]?.message ||
            "Success",
          type: Array.isArray(data) ? "array" : typeof data,
          data: data
        };
      })
    );
  }
}
