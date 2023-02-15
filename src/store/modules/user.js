import {security} from '@/server/axios.js';
const user = {
  state: {
    userInfos: { //用户信息类
      token: '',
      user: {},
      userNew: false
    }
  },
  mutations: {
    // 改变当前用户数据
    changeCurrentUerInfos(state, newUserInfos) {
      let saveData = JSON.stringify(newUserInfos)
      sessionStorage.setItem('userInfos', saveData)
      state.userInfos = newUserInfos
    },
    // 抹去当前用户数据
    removeCurrentUserInfos(state) {
      sessionStorage.removeItem('userInfos')
      state.userInfos = Object.assign({},{
        token: '',
        user: {userId: ''}
      })
    },
    // 更换手机号码,重置sessionStorage
    changeUserPhone(state, phone) {
      sessionStorage.removeItem('userInfos')
      state.userInfos.user.phone = phone
      let saveData = JSON.stringify(state.userInfos)
      sessionStorage.setItem('userInfos', saveData)
    },
    // 更新我的信息
    changeMsgState(state, t) {
      state.userNew = t
    }
  },
  actions: {
    changeCurrentUerInfos(context, formData) {
      context.commit('changeCurrentUerInfos', formData)
      security.getNewmsg().then((res) => {
        if (res.code === '200') {
          let state = res.data.msgCount == '0' ? false : true
          context.commit('changeMsgState', state)
        }
      })
    },
    removeCurrentUserInfo(context) {
      context.commit('removeCurrentUserInfos')
    },
    changeUserPhone(context, phone) {
      context.commit('changeUserPhone', phone)
    }
  },
  getters: {
    getCurrentUserInfos(state) {
      const sessionUserInfos = sessionStorage.getItem('userInfos')
      if (!state.userInfos.token && sessionUserInfos) {
        state.userInfos = JSON.parse(sessionUserInfos)
      }
      return state.userInfos
    },
    getMsgState(state) {
      return state.userNew
    }
  }
}
export default user
