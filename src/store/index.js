import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import account from './modules/account'
// 自选
import myOptional from './modules/myOptional'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    account,
    myOptional
  }
})
