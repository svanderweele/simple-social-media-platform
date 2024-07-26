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
import { handleMessages } from './entrypoints/realtime.consumer';
import { initialiseSockets } from './entrypoints/realtime.sockets';

process.on('uncaughtException', (error: Error) => {
  handler.handleError(error, null);
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  handler.handleError(new UnhandledError(reason), null);
});

server.listen(getEnvironmentVariable('PORT'), async () => {
  validateEnvironmentVariables();
  initialiseSockets(server);
  await initialiseAndGetDataSource();
  await setupKafka();
  handleMessages();
  console.log(`Server listening on port ${getEnvironmentVariable('PORT')}`);
});
