import { mount } from '@vue/test-utils';
import axios from 'axios';
import Vue from 'vue';
import ProductList from '.';
import Search from '@/components/Search.vue';
import ProductCard from '@/components/ProductCard.vue';
import { makeServer } from '@/miragejs/server';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList - integration', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const products = server.createList('product', 10);

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    const cards = wrapper.findAllComponents(ProductCard);

    expect(cards).toHaveLength(10);
  });

  it('should display the error message when Promise rejects', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('error list')));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Problem loading a list');
  });
});