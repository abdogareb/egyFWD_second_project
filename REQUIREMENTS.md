# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: '/products' [Get]
- Show: '/products/:id' [Get]
- Create '/products' [Post] [req.body:{name,price,category}] [token required]
- [OPTIONAL] Products by category (args: product category) '/products/category/:category' [Post]

#### Users

- Index: '/users' [Get] [token required]
- Show: '/users/:id' [Get] [token required]
- Create: '/users' [Post] [req.body:{first_name,last_name,password}] [token required]
- Authenticate user and get the token: '/user_authentication' [Get] [req.body:{id,password}]

#### Orders

- Current Order by user (args: user id): '/currentOrder/:userId' [Get] [token required]
- [OPTIONAL] Completed Orders by user (args: user id): '/completedOrders/:userId' [Get] [token required]
- Index: '/orders' [Get]
- Show: '/orders/:id' [Get]
- Create '/orders' [Post] [req.body:{status,userId}]
- Add product to an order '/orders/:orderId/product' [Post] [req.body:{quantity,productId}] [token required]

## Data Shapes

#### Products

- id serial primary key
- name varchar
- price integer
- [OPTIONAL] category varchar

#### Users

- id serial primary key
- firstName varchar
- lastName varchar
- password varchar

#### Orders

- id serial primary key
- id of each product in the order
- quantity of each product in the order
- user_id bigint [foreign key to users table]
- status of order varchar

#### order_products

- id serial primary key
- quantity integer
- order_id bigint [foreign key to orders table]
- product_id bigint [foreign key to products table]
