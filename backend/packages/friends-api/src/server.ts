import {
  getEnvironmentVariable,
  handler,
  setupKafka,
  validateEnvironmentVariables,
} from '@svdw/common';
import server from './app';
import { initialiseAndGetDataSource } from './repository/datasource';
import 'dotenv/config';
import { UnhandledError } from '@svdw/common';
import { setupMessaging } from './entrypoints/friends.messaging';

process.on('uncaughtException', (error: Error) => {
  handler.handleError(error, null);
});

process.on('unhandledRejection', (reason) => {
  handler.handleError(new UnhandledError(reason), null);
});

server.listen(getEnvironmentVariable('PORT'), async () => {
  validateEnvironmentVariables();
  await initialiseAndGetDataSource();
  await setupKafka();
  setupMessaging();
  console.log(`Server listening on port ${getEnvironmentVariable('PORT')}`);
});
