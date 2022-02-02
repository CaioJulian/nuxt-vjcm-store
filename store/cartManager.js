export const state = () => ({
  open: false,
  items: [],
});

export const mutations = {
  updateOpen(state, payload) {
    state.open = payload;
  },

  toggleOpen(state) {
    state.open = !state.open;
  },

  addProduct(state, payload) {
    const exists = !!state.items.find(({ id }) => id === payload.id);

    if (!exists) state.items.push(payload);
  },
};
