import { User, UserStore } from '../../models/user';
import bcrypt from 'bcrypt';

const { BCRYPT_PASSWORD } = process.env;
const store = new UserStore();

describe('user Model', () => {
  it('create method should add a user', async (): Promise<void> => {
    const user: User = {
      first_name: 'Ahmed',
      last_name: 'Essam',
      password: 'password'
    };
    const result = await store.create(user);
    expect(result.id).toEqual(3);
    expect(result.first_name).toEqual(user.first_name);
    expect(result.last_name).toEqual(user.last_name);
    expect(
      bcrypt.compareSync(
        (user.password as string) + BCRYPT_PASSWORD,
        result.password as string
      )
    ).toEqual(true);
  });
  it('index method should return a list of users', async (): Promise<void> => {
    const result = await store.index();
    expect(result[2].id).toEqual(3);
    expect(result[2].first_name).toEqual('Ahmed');
    expect(result[2].last_name).toEqual('Essam');
    expect(
      bcrypt.compareSync('password' + BCRYPT_PASSWORD, result[2].password as string)
    ).toEqual(true);
  });
  it('show method should return the correct user', async (): Promise<void> => {
    const result = await store.show(3);
    expect(result.id).toEqual(3);
    expect(result.first_name).toEqual('Ahmed');
    expect(result.last_name).toEqual('Essam');
    expect(
      bcrypt.compareSync('password' + BCRYPT_PASSWORD, result.password as string)
    ).toEqual(true);
  });
});
