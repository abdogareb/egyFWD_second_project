import { Product, ProductStore } from '../../models/product';

const store = new ProductStore();

describe('product Model', () => {
  it('create method should add a product', async () => {
    const product: Product = {
      name: 'Product Name',
      price: 100,
      category: 'Category'
    };
    const result = await store.create(product.name, product.price, product.category);
    expect(result).toEqual({
      id: 3,
      name: product.name,
      price: product.price,
      category: product.category
    });
  });
  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result.length).toEqual(3);
    expect(result[2]).toEqual({
      id: 3,
      name: 'Product Name',
      price: 100,
      category: 'Category'
    });
  });
  it('show method should return the correct product', async () => {
    const result = await store.show(3);
    expect(result).toEqual({
      id: 3,
      name: 'Product Name',
      price: 100,
      category: 'Category'
    });
  });
  it('productsByCategory method should return the product with the correct category', async () => {
    const result = await store.productsByCategory('Category');
    expect(result).toEqual([
      {
        id: 3,
        name: 'Product Name',
        price: 100,
        category: 'Category'
      }
    ]);
  });
});
