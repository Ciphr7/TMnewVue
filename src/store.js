import { createStore } from 'vuex';

export default createStore({
  state: {
    tresults: [],
  },
  mutations: {
    setTResults(state, data) {
      state.tresults = data;
    },
  },
});