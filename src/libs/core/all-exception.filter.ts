import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ExceptionFilter
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";
import ResponseConstants from "src/constants/response.constant";
import { ILogger, Logger } from "../logging/logger";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: ILogger = Logger.getLogger();
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : ResponseConstants.Common[500];

    if (!errResponse.valueOf().hasOwnProperty("code")) {
      const message =
        typeof errResponse === "string"
          ? errResponse
          : errResponse instanceof Error
          ? errResponse.message
          : "";

      errResponse = ResponseConstants.Common[status];
      message &&
        errResponse instanceof Object &&
        (errResponse.message = message);

      if (errResponse === undefined || errResponse === null) {
        this.logger.error(
          `Could not find common response constant for status ${status}. Defaulting to 500.`
        );
        errResponse = ResponseConstants.Common[500];
        message && (errResponse.message = message);
      }
    }

    this.logger.error(
      `[${httpAdapter.getRequestMethod(
        ctx.getRequest()
      )} - ${httpAdapter.getRequestUrl(ctx.getRequest())}] => ${
        exception.message
      }      

      ${exception.stack}
      }`
    );

    response.status(status).json(errResponse);
  }
}
