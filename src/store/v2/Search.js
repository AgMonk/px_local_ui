// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        illust: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        searchIllust: ({dispatch, commit, state, rootGetters}, {keywords, params: {page, mode, scd, ecd}, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illust,
                force, key: JSON.stringify({keywords, page, mode, scd, ecd}),
                seconds: 10 * 60,
                requestMethod: () => {
                    return rootGetters["getApi"].illustManga.search(keywords, {
                        p: page, mode, scd, ecd,
                        order: 'date_d',
                        lang: 'zh',
                    })
                }
            })
        },
    },
    getters: {}
    ,
}