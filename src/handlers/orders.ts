import express from 'express';
import { Order, OrderStore } from '../models/order';
import jwt from 'jsonwebtoken';

const store = new OrderStore();

const currentOrderByUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const order: Order = await store.currentOrderByUser(parseInt(req.params.userId));
    res.json(order);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const completedOrdersByUser = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const orders: Order[] = await store.completedOrdersByUser(req.params.userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const index = async (_req: express.Request, res: express.Response) => {
  try {
    const orders: Order[] = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
const show = async (req: express.Request, res: express.Response) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    const userId: number = (decoded as jwt.JwtPayload).user.id;
    const order: Order = await store.show(parseInt(req.params.id), userId);
    res.json(order);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
const create = async (req: express.Request, res: express.Response) => {
  try {
    const order: Order = await store.create(req.body.status, req.body.userId);
    res.json(order);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const createOrderProduct = async (req: express.Request, res: express.Response) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    const userId = (decoded as jwt.JwtPayload).user.id;
    const orderProduct = await store.createOrderProduct(
      req.body.quantity,
      req.params.orderId,
      req.body.productId,
      userId
    );
    res.json(orderProduct);
  } catch (err) {
    res.status(400);
    res.json((err as Error).message);
  }
};

const verifyAuthToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    if ((decoded as jwt.JwtPayload).user.id !== parseInt(req.params.userId)) {
      throw new Error('User id does not match!');
    }
    next();
  } catch (err) {
    res.status(401).json(`invalid token ${err}`);
  }
};

const verifyAuthTokenOrder = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.status(401).json(`invalid token ${err}`);
  }
};

const order_routes = (app: express.Application) => {
  app.get('/currentOrder/:userId', verifyAuthToken, currentOrderByUser);
  app.get('/completedOrders/:userId', verifyAuthToken, completedOrdersByUser);
  app.get('/orders', verifyAuthTokenOrder, index);
  app.get('/orders/:id', verifyAuthTokenOrder, show);
  app.post('/orders', verifyAuthTokenOrder, create);
  app.post('/orders/:orderId/product', verifyAuthTokenOrder, createOrderProduct);
};

export default order_routes;
