// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

import {follow, getUserInfo, unfollow} from "@/assets/js/request/user";
import {getCache} from "@/assets/js/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        cache: {}
    },
    mutations: {
        method(state, payload) {

        },
        saveInfo2Cache(state, value) {
            const k = `${value.id}`
            state.cache[k] = Object.assign({}, state.cache[k], value)
            // console.log(state.cache[k])
        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        follow: ({dispatch, commit, state}, {uid, token}) => {
            const key = `${uid}`;
            return follow(uid, token).then(() => {
                state.cache[key].isFollowed = true
            })
        },
        unfollow: ({dispatch, commit, state}, {uid, token}) => {
            const key = `${uid}`;
            return unfollow(uid, token).then(() => {
                state.cache[key].isFollowed = false
            })
        },
        getUserInfo: ({dispatch, commit, state}, {uid, force}) => {
            const key = `${uid}`;
            return getCache({
                cacheObj: state.cache, key,
                requestMethod: () => getUserInfo(uid),
                useCache: (cache) => cache.hasOwnProperty("following") && cache.hasOwnProperty("isFollowed"),
                saveCache: (cacheObj, key, body) => commit("saveInfo2Cache", body),
            })
        },


    },
    getters: {
        getUserFromCache: (state) => (uid) => {
            return state.cache[`${uid}`]
        },
    },
}