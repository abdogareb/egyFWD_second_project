import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import user_routes from './handlers/users';
import order_routes from './handlers/orders';
import product_routes from './handlers/products';

export const app: express.Application = express();
const port: number = 3000;

app.use(cors());
app.use(bodyParser.json());
user_routes(app);
order_routes(app);
product_routes(app);

app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Welcome!');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
