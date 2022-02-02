import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { cloneDeep } from 'lodash';
import * as cartManager from '@/store/cartManager.js';
import { makeServer } from '@/miragejs/server';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('cartManager - unit', () => {
  let server, store;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    store = new Store(cloneDeep(cartManager));
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should set cart to open', () => {
    store.commit('open');

    expect(store.state.open).toBe(true);
  });

  it('should set cart to closed', () => {
    store.commit('close');

    expect(store.state.open).toBe(false);
  });

  it('should add product to the cart only once', async () => {
    const product = server.create('product');

    await store.dispatch('addProduct', product);
    await store.dispatch('addProduct', product);

    expect(store.state.items).toHaveLength(1);
  });

  it('should remove product from the cart', async () => {
    const product = server.create('product');

    await store.dispatch('addProduct', product);

    await store.commit('removeProduct', product.id);

    expect(store.state.items).toHaveLength(0);
  });

  it('should clear products', async () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    await store.dispatch('addProduct', product1);
    await store.dispatch('addProduct', product2);

    await store.commit('clearProducts');

    expect(store.state.items).toHaveLength(0);
  });

  it('should clear cart', async () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    await store.dispatch('addProduct', product1);
    await store.dispatch('addProduct', product2);
    store.commit('open');

    await store.dispatch('clearCart');

    expect(store.state.items).toHaveLength(0);
    expect(store.state.open).toBe(false);
  });

  it('should return true if cart is not empty', async () => {
    const product1 = server.create('product');
    const product2 = server.create('product');

    await store.dispatch('addProduct', product1);
    await store.dispatch('addProduct', product2);

    const hasProducts = await store.getters.hasProducts;

    expect(hasProducts).toBe(true);
  });

  it('should return true if product is already in the cart', async () => {
    const product = server.create('product');

    await store.dispatch('addProduct', product);

    const exists = await store.dispatch('productIsInTheCart', product);

    expect(exists).toBe(true);
  });

});
