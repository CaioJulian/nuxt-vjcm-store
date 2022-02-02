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

  it('should set cart to open - true', () => {
    store.commit('updateOpen', true);

    expect(store.state.open).toBe(true);
  });

  it('should set cart to open - false', () => {
    store.commit('updateOpen', false);

    expect(store.state.open).toBe(false);
  });

  it('should add product to the cart only once', () => {
    const product = server.create('product');

    store.commit('addProduct', product);
    store.commit('addProduct', product);

    expect(store.state.items).toHaveLength(1);
  });
});
