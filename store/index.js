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

  addItem(state, payload) {
    state.items.push(payload);
  },
};
