import express from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';

const store = new ProductStore();

const index = async (_req: express.Request, res: express.Response) => {
  try {
    const products: Product[] = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
const show = async (req: express.Request, res: express.Response) => {
  try {
    const product: Product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
const create = async (req: express.Request, res: express.Response) => {
  try {
    const product: Product = await store.create(
      req.body.name,
      req.body.price,
      req.body.category
    );
    res.json(product);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const productsByCategory = async (req: express.Request, res: express.Response) => {
  try {
    const products: Product[] = await store.productsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400).json((err as Error).message);
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
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.status(401).json(`invalid token ${err}`);
  }
};

const product_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.get('/products/category/:category', productsByCategory);
};

export default product_routes;
