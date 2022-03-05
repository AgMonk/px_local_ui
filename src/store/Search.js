// 搜索
// noinspection JSUnusedLocalSymbols

import {getCacheByTime} from "@/assets/js/utils/CacheUtils";
import {search} from "@/assets/js/request/search";
import {distinctById} from "@/assets/js/utils/ObjUtils";

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
        getSearchResult: ({dispatch, commit, state}, {keyword, page = 1, scd, ecd, mode, force}) => {
            const now = new Date().getTimeSeconds();
            return getCacheByTime({
                cacheObj: state.cache,
                key: `搜索关键字 ${keyword}  第${page}页 ${scd} ${ecd}`,
                requestMethod: () => search(keyword, {page, scd, ecd, mode}),
                seconds: 30 * 60,
                force,
            }).then(res => {
                // console.log(res)
                const {popular, relatedTags, total, authors, illusts} = res
                const {recent, permanent} = popular
                authors.forEach(author => commit('User/saveInfo2Cache', author, {root: true}))
                const array = distinctById([...illusts, ...recent, ...permanent])
                array.forEach(i => commit('Artworks/saveInfo2Cache', {key: `${i.id}`, value: {time: now, data: i}}, {root: true}))
                return {popular, relatedTags, total, illusts}
            })

        },
    },
    getters: {},
}