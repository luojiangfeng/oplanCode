const state = {
  theme: {
    userCustomBanner: false,
    customBannerPath: ""
  }
}

const mutations = {
  RESET_THEME(state, payload) {
    let keyArr = []
    for (let key in payload) {
      state.theme[key] = payload[key]
    }
  }
}

const actions = {
  someAsyncTask({ commit }) {
    // do something async
    commit("INCREMENT_MAIN_COUNTER")
  }
}

export default {
  state,
  mutations,
  actions
}
