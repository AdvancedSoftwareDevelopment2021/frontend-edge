import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import device from './module/device'
import sensor from './module/sensor'
import process from './module/process'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    device,
    sensor,
    process
  }
})
