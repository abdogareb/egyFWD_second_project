create table orders
(
    id serial primary key,
    status varchar(64),
    user_id bigint references users(id)
);