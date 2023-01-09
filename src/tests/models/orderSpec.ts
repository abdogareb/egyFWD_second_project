import { Order, OrderStore } from '../../models/order';
const store = new OrderStore();

describe('order Model', () => {
  it('create method should add a order', async (): Promise<void> => {
    const order: Order = {
      status: 'active',
      user_id: '1'
    };
    const result = await store.create(order.status, order.user_id);
    expect(result).toEqual({
      id: 3,
      status: order.status,
      user_id: order.user_id
    });
  });
  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result.length).toEqual(3);
    expect(result[2]).toEqual({
      id: 3,
      status: 'active',
      user_id: '1'
    });
  });
  it('show method should return the correct order', async () => {
    const result = await store.show(3);
    expect(result).toEqual({
      id: 3,
      status: 'active',
      user_id: '1'
    });
  });

  it('currentOrderByUser method should return the last order created by the user', async () => {
    const result: Order = await store.currentOrderByUser(parseInt('1'));
    expect(result).toEqual({
      id: 3,
      status: 'active',
      user_id: '1'
    });
  });
  it('completedOrdersByUser method should return the completed orders by the user', async () => {
    const result: Order[] = await store.completedOrdersByUser('1');
    expect(result).toEqual([
      {
        id: 2,
        status: 'complete',
        user_id: '1'
      }
    ]);
  });
  it('createOrderProduct method should add product to the correct order', async () => {
    const result = await store.createOrderProduct(10, '1', '1', 1);
    expect(result).toEqual({
      id: 2,
      quantity: 10,
      order_id: '1',
      product_id: '1'
    });
  });
});
