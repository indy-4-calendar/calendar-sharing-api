import winston from 'winston';
import 'winston-daily-rotate-file';

import config from '@/constants';

const prettyJson = winston.format.printf((info) => {
  if (info.message?.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4);
  }

  return `${info.timestamp} ${info.label || '-'} ${info.level}: ${
    info.message
  }`;
});

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'white',
});

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.prettyPrint(),
  winston.format.splat(),
  winston.format.simple(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  prettyJson,
);

const fileFormat = winston.format.combine(
  winston.format.prettyPrint(),
  winston.format.splat(),
  winston.format.simple(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  prettyJson,
);

const logger = winston.createLogger({
  silent: config.LoggerLevel === 'silent' || config.IsTestingEnv,
  // format: consoleFormat,
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      level: config.LoggerLevel,
    }),
    new winston.transports.DailyRotateFile({
      level: 'http',
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
});

export default logger;
