import {addOptionalCoin,getOptionalCoin,cancelOptionalCoin} from '@/server/axios';
import router from '../../router';
// 自选股/coin
const myOptional = {
    state: {
        optionals: [] // 该用户所有的自选
    },
    mutations: {
        CHANGEOPTIONALS(state, payload) {
            state.optionals = payload.newOptionals;
        }
    },
    actions: {
        // 添加自选
        addMyOptionals({dispatch},symbol) {
            return new Promise((resolve,reject) => {
                addOptionalCoin(symbol).then(res => {
                    if (res.code == 200) {
                        dispatch('getMyOptionals')
                        resolve()
                    } else if (res.code == 40009) {
                        router.push('/login')
                        reject(res)
                    } else {
                        reject(res)
                    }
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        // 刪除自選
        cancelMyOptionals({dispatch}, symbol) {
            return new Promise((resolve,reject) => {
                cancelOptionalCoin(symbol).then(res => {
                    if (res.code == 200) {
                        dispatch('getMyOptionals')
                        resolve()
                    } else {
                        reject(res)
                    }
                }).catch((error) => {
                    reject(error)
                })
            })
        },
        // 获取自选
        getMyOptionals({commit}) {
            getOptionalCoin().then(res => {
                commit({
                    type: 'CHANGEOPTIONALS',
                    newOptionals: res.data.symbols
                })
            })
        }
    },
    getters: {
        getMyOptionals(state) {
            return state.optionals
        }
    }
}

export default myOptional;