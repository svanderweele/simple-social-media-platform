import { Request, Response } from 'express';
import { register } from '../../../src/controllers/auth.controller';
import * as authService from '../../../src/services/auth.service';
import 'dotenv/config';

import {
  createRequest,
  createResponse,
  MockRequest,
  MockResponse,
} from 'node-mocks-http';

describe('Auth Controller', () => {
  it('should return 201', async () => {
    // Arrange
    const req: MockRequest<Request> = createRequest({
      body: {
        email: 'test@email.com',
        password: 'test@email.com',
        name: 'some name',
      },
    });

    const res: MockResponse<Response> = createResponse();

    const mockFunction = jest.fn();
    jest
      .spyOn(authService, 'register')
      .mockImplementation(() => Promise.resolve());

    // Act
    await register(req, res, mockFunction);

    // Assert
    expect(res).toHaveProperty('statusCode', 201);
  });
  it('should pass on any errors', async () => {
    // Arrange
    const req: MockRequest<Request> = createRequest({
      body: {
        email: 'test@email.com',
        password: 'test@email.com',
        name: 'some name',
      },
    });
    const res: MockResponse<Response> = createResponse();

    const mockFunction = jest.fn();
    jest
      .spyOn(authService, 'register')
      .mockImplementation(() => Promise.reject('some blown up error'));

    // Act
    await register(req, res, mockFunction);

    // Assert
    expect(mockFunction).toHaveBeenCalled();
  });
});
