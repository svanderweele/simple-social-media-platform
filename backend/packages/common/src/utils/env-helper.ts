/* eslint-disable no-process-env */
import MissingEnvironmentVariablesError from '../errors/missing-environment-variables.error';
import { getLogger, isLoggerInitialised } from './logger';

export const keys = [
  'JWT_SECRET',
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE_PASS',
  'DATABASE_NAME',
  'PORT',
  'NODE_ENV',
  'SERVICE_NAME',
  'KAFKA_HOST',
  'KAFKA_PORT',
] as const;

export type EnvironmentVariableKey = (typeof keys)[number];

export function validateEnvironmentVariables() {
  const missingVariables = keys.filter(
    (variable: string) => !process.env[variable],
  );

  if (missingVariables.length) {
    getLogger().error(
      `Missing environment variables ${missingVariables.toString()}`,
      missingVariables,
    );
    throw new MissingEnvironmentVariablesError(missingVariables);
  }
}

export function setEnvironmentVariable<T extends EnvironmentVariableKey>(
  key: T,
  value: string,
): void {
  process.env[key] = value;
}

export function getEnvironmentVariable<T extends EnvironmentVariableKey>(
  key: T,
): string {
  const value = process.env[key];
  if (!value) {
    if (isLoggerInitialised()) {
      getLogger().error(`Missing environment variable: ${key.toString()}`, key);
    } else {
      console.error(`Missing environment variable: ${key.toString()}`, key);
    }
    throw new MissingEnvironmentVariablesError([key]);
  }

  return value;
}
