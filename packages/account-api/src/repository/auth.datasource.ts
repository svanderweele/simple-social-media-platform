import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Account } from '../entities/account.entity';
import { User } from '../entities/user.entity';
import { DatabaseError, getEnvironmentVariable, getLogger } from '@svdw/common';

let datasource: DataSource | undefined = undefined;

export const getDataSource = (): DataSource => {
  if (!datasource) {
    throw new DatabaseError('Database is not setup');
  }

  return datasource;
};

export const initialiseAndGetDataSource = async (): Promise<DataSource> => {
  try {
    datasource = new DataSource({
      type: 'postgres',
      host: getEnvironmentVariable('DATABASE_HOST'),
      port: Number.parseInt(getEnvironmentVariable('DATABASE_PORT') ?? '5432'),
      username: getEnvironmentVariable('DATABASE_USER'),
      password: getEnvironmentVariable('DATABASE_PASS'),
      database: getEnvironmentVariable('DATABASE_NAME'),
      synchronize: getEnvironmentVariable('NODE_ENV') === 'development',
      // logging: getEnvironmentVariable('NODE_ENV') === 'development',
      logging: false,
      entities: [Account, User],
      subscribers: [],
      migrations: [],
    });

    await datasource.initialize();
    return datasource;
  } catch (error) {
    getLogger().error('Failed to connect to database ', error);
    throw error;
  }
};
