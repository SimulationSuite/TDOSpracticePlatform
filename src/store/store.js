import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
var store = new Vuex.Store({
  state: {
    num: 100,
  },
  getters: {
    getNum (state) {
      return state.num
    }
  },
  mutations: {
    add (state, value) {
      state.num = value
    }
  }
})
export default store
