import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: string;
};
export type OrderProduct = {
  id: number;
  quantity: number;
  order_id: string;
  product_id: string;
};

export class OrderStore {
  async currentOrderByUser(userId: number): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders where user_id=($1) order by id desc limit 1';

      const result = await conn.query(sql, [userId]);

      conn.release();
      return result.rows[0] as Order;
    } catch (err) {
      throw new Error(
        `Could not get orders for user with id ${userId}. Error: ${
          (err as Error).message
        }`
      );
    }
  }
  async completedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders where user_id=($1) and status='complete'`;

      const result = await conn.query(sql, [userId]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(
        `Could not get completed orders for user with id ${userId}. Error: ${
          (err as Error).message
        }`
      );
    }
  }
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${(err as Error).message}`);
    }
  }
  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${(err as Error).message}`);
    }
  }
  async create(status: string, user_id: string): Promise<Order> {
    try {
      const sql = 'INSERT INTO orders (status,user_id) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [status, user_id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(
        `Could not create new order with user_id : ${user_id} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
  async createOrderProduct(
    quantity: number,
    orderId: string,
    productId: string,
    userId: number
  ): Promise<OrderProduct> {
    try {
      const orderSql = 'SELECT * FROM orders WHERE id=($1)';
      const orderConn = await Client.connect();

      const orderResult = await orderConn.query(orderSql, [orderId]);

      const order = orderResult.rows[0];
      if (parseInt(order.user_id) !== userId) {
        throw new Error(`unauthorized user`);
      }
      if (order.status !== 'active') {
        throw new Error(`Order status is ${order.status}`);
      }
      const sql =
        'INSERT INTO order_products (quantity,order_id,product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);
      const orderProduct = result.rows[0];

      conn.release();
      return orderProduct;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId} . Error: ${
          (err as Error).message
        }`
      );
    }
  }
}
