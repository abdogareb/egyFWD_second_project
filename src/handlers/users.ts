import express from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const store = new UserStore();

const index = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const users: User[] = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const show = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const user: User = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};

const create = async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };
    const newUser: User = await store.create(user);
    delete newUser.password;
    const token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400).json((err as Error).message);
  }
};
const authenticate = async (req: express.Request, res: express.Response) => {
  try {
    const result: User = await store.authenticate(req.body.id, req.body.password);
    delete result.password;
    const token = jwt.sign({ user: result }, process.env.TOKEN_SECRET as string);
    res.json(token);
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

const user_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', verifyAuthToken, create);
  app.get('/user_authentication', authenticate);
};

export default user_routes;
