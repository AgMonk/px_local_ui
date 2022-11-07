// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        //最新小说缓存
        latest: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //最新小说
        followLatest: ({dispatch, commit, state, rootGetters}, {force, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.latest, force, key: page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.followLatest(page, "all", "zh").then(res => {
                        return res.thumbnails.novel
                    })
                }
            })
        },
    },
    getters: {},
}