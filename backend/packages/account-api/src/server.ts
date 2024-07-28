import {
  getEnvironmentVariable,
  handler,
  setupKafka,
  validateEnvironmentVariables,
} from '@svdw/common';
import app from './app';
import { initialiseAndGetDataSource } from './repository/auth.datasource';
import 'dotenv/config';
import { UnhandledError } from '@svdw/common';

process.on('uncaughtException', (error: Error) => {
  handler.handleError(error, null);
});

process.on('unhandledRejection', (reason) => {
  handler.handleError(new UnhandledError(reason), null);
});

app.listen(getEnvironmentVariable('PORT'), async () => {
  validateEnvironmentVariables();
  try {
    await initialiseAndGetDataSource();
  } catch (error) {
    console.error('Failed to connect to db ', error);
  }

  await setupKafka();
  console.log(`Server listening on port ${getEnvironmentVariable('PORT')}`);
});
