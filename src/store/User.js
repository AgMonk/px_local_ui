// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/js/request/user";

export default {
    namespaced: true,
    state: {
        cache:{}
    },
    mutations: {
        method(state, payload) {

        },
        saveInfo2Cache(state, value) {
            const k = `${value.id}`
            state.cache[k] = Object.assign({},state.cache[k],value)
            // console.log(state.cache[k])
        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        getUserInfo: ({dispatch, commit, state}, {uid,force}) => {
            return getUserInfo(uid).then(res => {
                commit("saveInfo2Cache",res)
            })
        },

    },
    getters: {},
}