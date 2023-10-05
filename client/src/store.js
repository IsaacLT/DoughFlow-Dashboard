import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    selectedBudget: null
  },
  mutations: {
    setSelectedBudget(state, budget) {
      state.selectedBudget = budget
    }
  },
  actions: {
    updateSelectedBudget({ commit }, budget) {
      commit('setSelectedBudget', budget)
    }
  },
  getters: {
    getSelectedBudget: (state) => state.selectedBudget
  }
})
