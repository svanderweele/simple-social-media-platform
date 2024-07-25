import request from 'supertest';

import app from '../../src/app';

describe('Testing App', () => {
  test('Ensure API returns not found for non existent routes', async () => {
    const res = await request(app).get('/');
    expect(res.body).toEqual({ message: 'Not Found' });
    expect(res.status).toBe(404);
  });

  test('Ensure API returns not found for non existent routes', async () => {
    const res = await request(app).get('/some-weird-route-that-should-fail');
    expect(res.body).toEqual({ message: 'Not Found' });
    expect(res.status).toBe(404);
  });
});
