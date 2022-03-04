// 关注作品
// noinspection JSUnusedLocalSymbols

import {getFollowLatest} from "@/assets/js/request/follow-latest";
import {getCacheByTime} from "@/assets/js/utils/CacheUtils";

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
        getFollowLatest: ({dispatch, commit, state}, {page, force}) => {
            const now = new Date().getTimeSeconds();
            return getCacheByTime({
                cacheObj: state.cache,
                key: `关注作品第${page}页`,
                requestMethod: () => getFollowLatest(page),
                seconds: 10 * 60,
                force,
            }).then(res => {
                const {authors, illusts} = res
                authors.forEach(author => commit('User/saveInfo2Cache', author, {root: true}))
                illusts.forEach(i => commit('Artworks/saveInfo2Cache', {key: `${i.id}`, value: {time: now, data: i}}, {root: true}))
                return illusts.map(i => i.id)
            })
        },

    },
    getters: {},
}