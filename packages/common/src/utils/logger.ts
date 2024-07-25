import winston, { createLogger, Logger } from 'winston';
import correlator from 'express-correlation-id';
import { getEnvironmentVariable } from './env-helper';

let appLogger: Logger;

export function isLoggerInitialised(): boolean {
  return !!appLogger;
}

export function getLogger(): Logger {
  if (!appLogger) {
    initialiseLogger();
  }

  appLogger.defaultMeta = {
    ['x-correlation-id']: correlator.getId(),
  };

  return appLogger;
}

export function initialiseLogger() {
  appLogger = createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: {
      service: getEnvironmentVariable('SERVICE_NAME'),
    },
    transports: [
      new winston.transports.Console({
        level: 'info',
      }),
    ],
  });
}
