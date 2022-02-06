import { mount, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import { makeServer } from '@/miragejs/server';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('CartItem - unit', () => {
  let server, store, cartManager;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    cartManager = {
      namespaced: true,
      mutations: {
        removeProduct: jest.fn(),
      },
    };

    store = new Store({
      modules: {
        cartManager,
      },
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  const mountCartItem = () => {
    const product = server.create('product', {
      title: 'Watch Mi',
      price: '89.99',
    });

    const wrapper = mount(CartItem, {
      propsData: {
        product,
      },
      store,
      localVue,
    });

    return { wrapper, product };
  };

  it('should mount the component', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem();

    const content = wrapper.text();

    expect(content).toContain(title);
    expect(content).toContain(price);
  });

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem();

    const quantity = wrapper.find('[data-testid="quantity"]');

    expect(quantity.text()).toContain('1');
  });

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="+"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('2');
  });

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem();
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should display a button to remove item from cart', () => {
    const { wrapper } = mountCartItem();
    const button = wrapper.find('[data-testid="remove-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, product } = mountCartItem();
    const button = wrapper.find('[data-testid="remove-button"]');
    const { mutations } = cartManager;
    const spy = jest.spyOn(mutations, 'removeProduct');

    await button.trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({}, product.id);
  });
});
