export const state = () => ({
  open: false,
  items: [],
});

export const mutations = {
  toggleOpen(state) {
    state.open = !state.open;
  },

  open(state) {
    state.open = true;
  },

  close(state) {
    state.open = false;
  },

  removeProduct(state, productId) {
    state.items = [
      ...state.items.filter((product) => product.id !== productId),
    ];
  },

  clearProducts(state) {
    state.items = [];
  },
};

export const getters = {
  hasProducts(state) {
    return state.items.length > 0;
  },
};

export const actions = {
  productIsInTheCart({ state }, product) {
    return !!state.items.find(({ id }) => id === product.id);
  },

  async addProduct({ state, dispatch }, payload) {
    const exists = await dispatch('productIsInTheCart', payload);

    if (!exists) state.items.push(payload);
  },

  clearCart({ commit }) {
    commit('clearProducts');
    commit('close');
  },
};
