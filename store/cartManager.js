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

  addProduct(state, payload) {
    const exists = !!state.items.find(({ id }) => id === payload.id);

    if (!exists) state.items.push(payload);
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
  clearCart({ commit }) {
    commit('clearProducts')
    commit('close')
  },
};
