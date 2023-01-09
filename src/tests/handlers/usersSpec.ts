import { User } from '../../models/user';
import supertest from 'supertest';
import { app } from '../../server';
import { token } from './ordersSpec';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD } = process.env;

const request = supertest(app);
describe('users handler', () => {
  it('create endpoint with token', async (): Promise<void> => {
    const user: User = {
      first_name: 'Ahmed',
      last_name: 'Essam',
      password: 'password'
    };
    const response = await request
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(user);
    expect(response.status).toBe(200);
  });
  it('create user endpoint without token ', async (): Promise<void> => {
    const user: User = {
      first_name: 'Ahmed',
      last_name: 'Essam',
      password: 'password'
    };
    const response = await request.post('/users').send(user);
    expect(response.status).toBe(401);
  });

  it('index endpoint with token', async (): Promise<void> => {
    const response = await request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[1].id).toEqual(2);
    expect(response.body[1].first_name).toEqual('Ahmed');
    expect(response.body[1].last_name).toEqual('Essam');
    expect(
      bcrypt.compareSync(
        'password' + BCRYPT_PASSWORD,
        response.body[1].password as string
      )
    ).toEqual(true);
  });
  it('index endpoint without token', async (): Promise<void> => {
    const response = await request.get('/users');
    expect(response.status).toBe(401);
  });
  it('show endpoint with token', async (): Promise<void> => {
    const response = await request
      .get('/users/2')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(2);
    expect(response.body.first_name).toEqual('Ahmed');
    expect(response.body.last_name).toEqual('Essam');
    expect(
      bcrypt.compareSync('password' + BCRYPT_PASSWORD, response.body.password as string)
    ).toEqual(true);
  });
  it('show endpoint without token', async (): Promise<void> => {
    const response = await request.get('/users/1');
    expect(response.status).toBe(401);
  });
});
