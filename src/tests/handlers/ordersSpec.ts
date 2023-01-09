import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../server';
import { User, UserStore } from '../../models/user';

const request = supertest(app);
const store = new UserStore();
export let token: string;
describe('order handler', () => {
  beforeAll(async () => {
    const user: User = {
      first_name: 'Test',
      last_name: 'Endpoint',
      password: 'password'
    };
    const result = await store.create(user);
    token = jwt.sign({ user: result }, process.env.TOKEN_SECRET as string);
  });
  it('create endpoint with token', async (): Promise<void> => {
    const response = await request
      .post('/orders')
      .send({
        status: 'active',
        userId: '1'
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('create endpoint without token', async (): Promise<void> => {
    const response = await request.post('/orders').send({
      status: 'active',
      userId: '1'
    });
    expect(response.status).toBe(401);
  });
  it('index method with token', async () => {
    const response = await request.get('/orders').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 1,
        status: 'active',
        user_id: '1'
      }
    ]);
  });
  it('index method without token', async () => {
    const response = await request.get('/orders');
    expect(response.status).toBe(401);
  });
  it('show endpoint with token', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      status: 'active',
      user_id: '1'
    });
  });
  it('show endpoint without token', async () => {
    const response = await request.get('/orders/1');
    expect(response.status).toBe(401);
  });
  it('completedOrdersByUser with token', async () => {
    await request
      .post('/orders')
      .send({
        status: 'complete',
        userId: '1'
      })
      .set('Authorization', `Bearer ${token}`);
    const response = await request
      .get('/completedOrders/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: 2,
        status: 'complete',
        user_id: '1'
      }
    ]);
  });
  it('completedOrdersByUser without token', async () => {
    const response = await request.get('/completedOrders/1');
    expect(response.status).toBe(401);
  });
  it('currentOrderByUser endpoint with token', async () => {
    const response = await request
      .get('/currentOrder/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 2,
      status: 'complete',
      user_id: '1'
    });
  });
  it('currentOrderByUser endpoint without token', async () => {
    const response = await request.get('/currentOrder/1');
    expect(response.status).toBe(401);
  });
  it('createOrderProduct endpoint with token', async () => {
    await request
      .post('/products')
      .send({ name: 'Product', price: 10, category: 'Test Endpoint' })
      .set('Authorization', `Bearer ${token}`);
    const response = await request
      .post('/orders/1/product')
      .send({
        quantity: 2,
        orderId: '1',
        productId: '1'
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('createOrderProduct endpoint with a complete order with token', async () => {
    const response = await request
      .post('/orders/2/product')
      .send({
        quantity: 2,
        productId: '1'
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});
