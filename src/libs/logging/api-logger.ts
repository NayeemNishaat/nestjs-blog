import { ILogger, Logger } from "./logger";
import morgan from "morgan";

const logger: ILogger = Logger.getLogger();
export const APILogger = morgan("combined", {
  stream: logger.getFileStream(),
  skip: (request, _) => {
    return request.url.includes("/api/v1/health");
  }
});
