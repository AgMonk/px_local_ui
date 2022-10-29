// Fanbox
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {listCreator, listFollowing, listHome} from "@/assets/js/fanbox/request";

export default {
    namespaced: true,
    state: {
        cache: {},
        home: {
            data: [],
            params: {
                maxId: undefined,
                maxPublishedDatetime: undefined,
                limit: 10,
            }
        }
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        listHome: ({dispatch, commit, state}, force) => {
            const key = JSON.stringify(state.home.params)
            if (force) {
                state.home = {
                    data: [],
                    params: {
                        maxId: undefined,
                        maxPublishedDatetime: undefined,
                        limit: 10,
                    }
                }
            }
            return getCacheByTime({
                cacheObj: state.cache, force,
                key: `主页时间流 ${key}`,
                requestMethod: () => listHome(state.home.params),
                seconds: 30 * 60,
            }).then(res => {
                state.home.data.push(...res.items)
                state.home.params = res.params
                return state.home.data
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