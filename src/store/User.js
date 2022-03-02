// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

import {getUserInfo} from "@/assets/js/request/user";
import {copyObj} from "@/assets/js/utils/ObjUtils";
import {getCache} from "@/assets/js/utils/CacheUtils";

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
            const key = `${uid}`;
            return getCache({
                cacheObj:state.cache,key,
                requestMethod:()=>getUserInfo(uid),
                useCache:(cache)=>cache.hasOwnProperty("following") && cache.hasOwnProperty("isFollowed"),
                saveCache:(cacheObj,key,body)=>commit("saveInfo2Cache",body),
            })
        },

    },
    getters: {},
}