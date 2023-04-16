import winston from "winston";
import Process from "process";

const printFormat = winston.format.printf(
  ({ level, message, label = "", timestamp }) => {
    return `[${label}] ${Process.pid} - ${timestamp} ${level} ${message}`;
  }
);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "FileUrl" },
  transports: [
    new winston.transports.Console({
      level: "info",
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.align(),
        winston.format.label({ label: "Application" }),
        winston.format.timestamp(),
        printFormat
      )
    })
  ]
});

export interface ILogger {
  getFileStream(): any;
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  debug(message: string, ...meta: any[]): void;
  verbose(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
}

export class Logger implements ILogger {
  static getLogger(): ILogger {
    const logger = new Logger();
    return logger;
  }

  getFileStream() {
    return {
      write: (message: string) => {
        logger.info(message);
      }
    };
  }

  info(message: string, ...meta: any[]): void {
    logger.info(message, ...meta);
  }
  warn(message: string, ...meta: any[]): void {
    logger.warn(message, ...meta);
  }
  debug(message: string, ...meta: any[]): void {
    logger.debug(message, ...meta);
  }
  verbose(message: string, ...meta: any[]): void {
    logger.verbose(message, ...meta);
  }
  error(message: string, ...meta: any[]): void {
    logger.error(message, ...meta);
  }
}
