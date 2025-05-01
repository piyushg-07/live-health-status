import request from 'supertest';
import { app } from '../src/index';

describe('Auth', () => {
  it('rejects bad credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'x', password: 'y' });
    expect(res.status).toBe(401);
  });

  it('accepts valid credentials', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mock-token');
  });
});
