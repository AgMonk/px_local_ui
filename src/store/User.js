// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/js/request/user";
import {copyObj} from "@/assets/js/utils/ObjUtils";

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
            const now = new Date().getTimeSeconds();
            const key = `${uid}`;
            const cache = state.cache[key];
            if (!force && cache && cache.hasOwnProperty("following")
                && cache.hasOwnProperty("isFollowed")
            ){
                console.log("从缓存读取数据 userInfo:" + key)
                return new Promise((r) => r(copyObj(cache)))
            }
            return getUserInfo(uid).then(res => {
                commit("saveInfo2Cache",res)
                return res;
            })
        },

    },
    getters: {},
}