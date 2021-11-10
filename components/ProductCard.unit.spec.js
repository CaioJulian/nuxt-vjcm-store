import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard.vue';
import { makeServer } from '@/miragejs/server';

describe('ProductCard - unit', () => {
  let server;
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Watch Rolex',
          price: '12.00',
          image:
            'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
        }),
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Watch Rolex',
          price: '12.00',
        }),
      },
    });

    // console.log(wrapper.html());

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Watch Rolex');
    expect(wrapper.text()).toContain('$12.00');
  });
});
