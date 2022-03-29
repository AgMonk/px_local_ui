// Fanbox
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {listCreator, listFollowing} from "@/assets/js/fanbox/request";

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        listFollowing: ({dispatch, commit, state},) => {
            return getCacheByTime({
                cacheObj: state.cache,
                key: `关注作者`,
                requestMethod: () => listFollowing(),
                seconds: 30 * 60,
            })
        },
        listCreator: ({dispatch, commit, state}, {id, force}) => {
            return getCacheByTime({
                cacheObj: state.cache,
                key: `创作者 ${id}`,
                requestMethod: () => listCreator(id),
                seconds: 30 * 60,
            })
        },
    },
    getters: {},
}