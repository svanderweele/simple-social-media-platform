import bcrypt from 'bcrypt';
import * as authRepository from '../repository/auth.repository';
import { getEnvironmentVariable, getLogger } from '@svdw/common';
import { AccountNotFoundError } from '../errors/account-not-found.error';
import { AccountInvalidCredentialsError } from '../errors/account-invalid-credentials.error';

import jwt from 'jsonwebtoken';
import { AccountCreatedProducer } from '../events/producers/account-created.producer';
import { AccountLoggedInProducer } from '../events/producers/account-logged-in.producer';

export async function login(email: string, password: string): Promise<string> {
  try {
    const account = await authRepository.getAccountByUsername(email);

    if (!account) {
      throw new AccountNotFoundError();
    }

    const isPasswordMatch = await bcrypt.compare(password, account.password);

    if (!isPasswordMatch) {
      throw new AccountInvalidCredentialsError();
    }

    const token = jwt.sign(
      { username: account.username, id: account.id },
      getEnvironmentVariable('JWT_SECRET'),
      {
        expiresIn: '1d',
      },
    );

    await new AccountLoggedInProducer().publish({
      accountId: account.id,
    });

    return token;
  } catch (error) {
    getLogger().error('Error trying to login', error);
    throw error;
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<void> {
  try {
    const hashedPassword = await bcrypt.hash(password, 3);
    const account = await authRepository.createAccount({
      email,
      hashedPassword,
      name,
    });

    //TODO: Rollback if kafka fails

    await new AccountCreatedProducer().publish({
      id: account.id,
      name: name,
      username: account.username,
    });
  } catch (error) {
    getLogger().error('Error trying to register', error);
    throw error;
  }
}
