// Fanbox
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {listCreator, listFollowing, listHome} from "@/assets/js/fanbox/request";

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
        listHome: ({dispatch, commit, state}, {limit = 10, maxId, force, maxPublishedDatetime}) => {
            return getCacheByTime({
                cacheObj: state.cache,
                key: `主页时间流 ${limit} - ${maxId} - ${maxPublishedDatetime}`,
                requestMethod: () => listHome({limit, maxId, maxPublishedDatetime}),
                seconds: 30 * 60,
            })
        },
        listFollowing: ({dispatch, commit, state},) => {
            return getCacheByTime({
                cacheObj: state.cache,
                key: `关注作者`,
                requestMethod: () => listFollowing(),
                seconds: 30 * 60,
            })
        },
        listCreator: ({dispatch, commit, state}, {id, size, maxId, force}) => {
            return getCacheByTime({
                cacheObj: state.cache,
                key: `创作者 ${id}`,
                requestMethod: () => listCreator(id, size, maxId),
                seconds: 30 * 60,
            })
        },
    },
    getters: {},
}