import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { KafkaContainer, StartedKafkaContainer } from '@testcontainers/kafka';
import { initialiseAndGetDataSource } from '../../src/repository/auth.datasource';
import { getLogger, setEnvironmentVariable, setupKafka } from '@svdw/common';
import { DataSource } from 'typeorm';

import 'dotenv/config';

let datasource: DataSource | undefined = undefined;
let kafkaContainer: StartedKafkaContainer;

export async function setupDb(): Promise<StartedPostgreSqlContainer> {
  const container = await new PostgreSqlContainer()
    .withUsername('testuser')
    .withPassword('testpassword')
    .withDatabase('auth_dev_tests')
    .withPrivilegedMode()
    .start();

  setEnvironmentVariable('DATABASE_HOST', container.getHost());
  setEnvironmentVariable('DATABASE_USER', container.getUsername());
  setEnvironmentVariable('DATABASE_PASS', container.getPassword());
  setEnvironmentVariable('DATABASE_PORT', container.getPort().toString());
  setEnvironmentVariable('DATABASE_NAME', container.getDatabase());

  try {
    datasource = await initialiseAndGetDataSource();
    await setupKafka();
  } catch (error) {
    getLogger().error(error);
    throw error;
  }

  return container;
}

export function destroyDb(): void {
  kafkaContainer.stop();
  datasource?.destroy();
}

export async function setupTestKafka(): Promise<StartedKafkaContainer> {
  kafkaContainer = await new KafkaContainer().withExposedPorts(9093).start();

  setEnvironmentVariable('KAFKA_HOST', kafkaContainer.getHost());
  setEnvironmentVariable(
    'KAFKA_PORT',
    kafkaContainer.getFirstMappedPort().toString(),
  );

  try {
    await setupKafka();
  } catch (error) {
    getLogger().error(error);
    throw error;
  }

  return kafkaContainer;
}
