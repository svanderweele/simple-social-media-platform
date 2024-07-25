import { login, register } from '../../../src/services/auth.service';
import * as authRepository from '../../../src/repository/auth.repository';
import bcrypt from 'bcrypt';
import { AccountRecord } from '../../../src/repository/auth.repository';
import { getLogger } from '@svdw/common';
import { Account } from '../../../src/entities/account.entity';
import jwt from 'jsonwebtoken';
import { AccountInvalidCredentialsError } from '../../../src/errors/account-invalid-credentials.error';
import 'dotenv/config';

jest.mock('@svdw/common', () => {
  return {
    ...jest.requireActual('@svdw/common'),
    getEnvironmentVariable: () => 'some-var',
  };
});

jest.mock('../../../src/events/producers/account-created.producer', () => {
  return {
    AccountCreatedProducer: function () {
      return {
        publish: jest.fn(),
      };
    },
  };
});

jest.mock('../../../src/events/producers/account-logged-in.producer', () => {
  return {
    AccountLoggedInProducer: function () {
      return {
        publish: jest.fn(),
      };
    },
  };
});

describe('Auth Service', () => {
  describe('Testing Registration', () => {
    it('should register an account', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
        name: 'Awesome Name',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('some-token'));

      const accountRecord: AccountRecord = {
        id: 'some-random-id',
        username: 'awesomename',
      };
      const repository = jest
        .spyOn(authRepository, 'createAccount')
        .mockImplementation(() => Promise.resolve(accountRecord));

      // Act
      await register(payload.email, payload.password, payload.name);

      // Assert
      expect(repository).toHaveBeenCalled();
    });

    it('should throw an error when bcrypt fails', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
        name: 'Awesome Name',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.reject('bcrypt error'));

      // Act
      const response = register(payload.email, payload.password, payload.name);

      // Assert
      await expect(response).rejects.toBe('bcrypt error');
    });

    it('should throw an error when the repository fails', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
        name: 'Awesome Name',
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('some-token'));

      jest
        .spyOn(authRepository, 'createAccount')
        .mockImplementation(() => Promise.reject('repository error'));

      // Act
      const response = register(payload.email, payload.password, payload.name);

      // Assert
      await expect(response).rejects.toBe('repository error');
    });

    it('should log when throwing an error', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
        name: 'Awesome Name',
      };

      const logCall = jest.spyOn(getLogger(), 'error');
      // Act
      const response = register(payload.email, payload.password, payload.name);

      // Assert
      await expect(response).rejects.toBe('repository error');
      expect(logCall).toHaveBeenCalled();
    });
  });

  describe('Testing Login', () => {
    it('should login to the account', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockImplementation(() => Promise.resolve({} as Account));

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      jest.spyOn(jwt, 'sign').mockImplementation(() => 'some-token');

      // Act
      const response = await login(payload.email, payload.password);

      // Assert
      expect(response).toBe('some-token');
    });

    it('should throw an error when repository fails', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockRejectedValue('error');

      // Act
      const response = login(payload.email, payload.password);

      // Assert
      await expect(response).rejects.toBe('error');
    });

    it('should throw an error when bcrypt fails', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockResolvedValue({} as Account);

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.reject('some bcrypt error'));

      // Act
      const response = login(payload.email, payload.password);

      // Assert
      await expect(response).rejects.toBe('some bcrypt error');
    });

    it('should throw an error when passwords do not match', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockImplementation(() => Promise.resolve({} as Account));

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      // Act
      const response = login(payload.email, payload.password);

      // Assert
      await expect(response).rejects.toThrow(AccountInvalidCredentialsError);
    });

    it('should throw an error when jwt fails', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockImplementation(() => Promise.resolve({} as Account));

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      jest
        .spyOn(jwt, 'sign')
        .mockImplementation(() => Promise.reject('some jwt error'));

      // Act
      const response = login(payload.email, payload.password);

      // Assert
      await expect(response).rejects.toBe('some jwt error');
    });

    it('should log when throwing an error', async () => {
      // Arrange
      const payload = {
        email: 'emailtest@gmail.com',
        password: 'testas123',
        name: 'Awesome Name',
      };

      jest
        .spyOn(authRepository, 'getAccountByUsername')
        .mockRejectedValue('error');

      const logCall = jest.spyOn(getLogger(), 'error');
      // Act
      const response = login(payload.email, payload.password);

      // Assert
      await expect(response).rejects.toBe('error');
      expect(logCall).toHaveBeenCalled();
    });
  });
});
