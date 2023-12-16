import { createStore } from 'vuex';

export default createStore({
  state: {
    tresults: [],
    lat: Number,
    lon: Number
  },
  mutations: {
    setTResults(state, data) {
      state.tresults = data;
    },
    setLon(state, lon ) {
      state.lon = lon;
    },
    setLat(state, lat ) {
      state.lat = lat;
    }
  },
});