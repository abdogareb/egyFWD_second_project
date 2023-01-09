import Client from '../database';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password?: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${(err as Error).message}`);
    }
  }
  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${(err as Error).message}`);
    }
  }
  async create(user: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (first_name,last_name,password) VALUES($1, $2, $3) RETURNING *';
      const hash = bcrypt.hashSync(
        (user.password as string) + BCRYPT_PASSWORD,
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [user.first_name, user.last_name, hash]);
      const resultUser = result.rows[0];
      conn.release();
      return resultUser;
    } catch (err) {
      throw new Error(
        `unable to create user (${user.first_name} ${user.last_name}): ${
          (err as Error).message
        }`
      );
    }
  }
  async authenticate(id: number, password: string): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users WHERE id = ($1)';
      const result = await conn.query(sql, [id]);

      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + BCRYPT_PASSWORD, user.password)) {
          return user;
        } else {
          throw new Error(`Wrong Password`);
        }
      } else {
        throw new Error(`No user found with id: ${id}`);
      }
    } catch (err) {
      throw new Error(`${(err as Error).message}`);
    }
  }
}
