import { mount } from '@vue/test-utils';
import CartItem from '@/components/CartItem.vue';
import { makeServer } from '@/miragejs/server';

describe('CartItem - unit', () => {
  let server;

  const mountCartItem = () => {
    const product = server.create('product', {
      title: 'Watch Mi',
      price: '89.99'
    });

    const wrapper = mount(CartItem, {
      propsData: {
        product
      }
    });

    return { wrapper, product }
  }

  beforeEach(() => {
  server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
  server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountCartItem();

    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const { wrapper, product: { title, price} } = mountCartItem();

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
});
