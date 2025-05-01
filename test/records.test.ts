import request from 'supertest';
import { app } from '../src/index';

let token: string;
beforeAll(async () => {
  const res = await request(app)
    .post('/login')
    .send({ username: 'admin', password: 'password' });
  token = res.body.token;
});

describe('Records CRUD', () => {
  let recId: string;

  it('creates a record', async () => {
    const res = await request(app)
      .post('/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Alice', age: 30, status: 'Healthy' });
    expect(res.status).toBe(201);
    recId = res.body.id;
  });

  it('fetches the record', async () => {
    const res = await request(app)
      .get(`/records/${recId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice');
  });

  it('updates the record', async () => {
    const res = await request(app)
      .put(`/records/${recId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Sick' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Sick');
  });

  it('deletes the record', async () => {
    const res = await request(app)
      .delete(`/records/${recId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
