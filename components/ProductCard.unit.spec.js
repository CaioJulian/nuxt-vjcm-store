import { mount, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import ProductCard from '@/components/ProductCard.vue';
import { makeServer } from '@/miragejs/server';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('ProductCard - unit', () => {
  let server, store, mutations;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });

    mutations = {
      updateOpen: jest.fn(),
      addItem: jest.fn(),
    };

    store = new Store({
      mutations
    });
  });

  afterEach(() => {
    server.shutdown();
  });

  const mountProductCard = () => {
    const product = server.create('product', {
      title: 'Watch Rolex',
      price: '12.00',
      image:
        'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
    });
    return {
      wrapper: mount(ProductCard, {
        propsData: {
          product,
        },
        store,
        localVue,
      }),
      product,
    };
  };

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCard();

    // console.log(wrapper.html());

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Watch Rolex');
    expect(wrapper.text()).toContain('$12.00');
  });

  it('should add item on button click', async () => {
    const { wrapper } = mountProductCard();

    await wrapper.find('button').trigger('click');

    expect(mutations.addItem).toHaveBeenCalled();
  });
});
