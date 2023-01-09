import { Product } from '../../models/product';
import supertest from 'supertest';
import { app } from '../../server';
import { token } from './ordersSpec';

const request = supertest(app);
describe('products handler', () => {
  it('create endpoint with token', async () => {
    const product: Product = {
      name: 'Product Name',
      price: 50,
      category: 'Test Endpoint'
    };
    const response = await request
      .post('/products')
      .send(product)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it('create endpoint without token', async () => {
    const product: Product = {
      name: 'Product Name',
      price: 50,
      category: 'Test Endpoint'
    };
    const response = await request.post('/products').send(product);
    expect(response.status).toBe(401);
  });
  it('index endpoint', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    expect(response.body[1]).toEqual({
      id: 2,
      name: 'Product Name',
      price: 50,
      category: 'Test Endpoint'
    });
  });
  it('show endpoint', async () => {
    const response = await request.get('/products/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 2,
      name: 'Product Name',
      price: 50,
      category: 'Test Endpoint'
    });
  });
});
