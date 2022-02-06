import { mount, createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import DefaultLayout from '@/layouts/default.vue';
import Cart from '@/components/Cart.vue';
import { state, mutations } from '@/store/cartManager.js';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('Default Layout - unit', () => {
  let store;

  beforeEach(() => {
    store = new Store({
      modules: {
        cartManager: {
          namespaced: true,
          state,
          mutations,
        },
      },
    });
  });

  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      store,
      localVue,
      stubs: {
        Nuxt: true,
      },
    });

    return { wrapper };
  };

  it('should mount Cart', () => {
    const { wrapper } = mountLayout();

    expect(wrapper.findComponent(Cart).exists()).toBe(true);
  });

  it('should toggle Cart visibility', async () => {
    const { wrapper } = mountLayout();
    const button = wrapper.find('[data-testid = "toggle-button"]');

    await button.trigger('click');
    expect(wrapper.vm.isCartOpen).toBe(true);
    await button.trigger('click');
    expect(wrapper.vm.isCartOpen).toBe(false);
  });
});
