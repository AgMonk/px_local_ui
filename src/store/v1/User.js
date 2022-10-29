// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

import {follow, getUserBookmark, getUserBookmarkTags, getUserInfo, getUserProfileAll, unfollow} from "@/assets/js/request/user";
import {getCache, getCacheByTime} from "@/assets/js/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        cache: {},
        profile: {},
        bookmark: {},
        tags: {},
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
        getUserInfo: ({dispatch, commit, state}, {uid, force = false}) => {
            const key = `${uid}`;
            return getCache({
                cacheObj: state.cache, key, force,
                requestMethod: () => getUserInfo(uid),
                useCache: (cache) => cache.hasOwnProperty("following") && cache.hasOwnProperty("isFollowed"),
                saveCache: (cacheObj, key, body) => commit("saveInfo2Cache", body),
            })
        },
        getUserProfileAll: ({dispatch, commit, state}, {uid, force = false}) => {
            return getCache({
                cacheObj: state.profile, force,
                key: `用户profile:${uid}`,
                requestMethod: () => getUserProfileAll(uid),
            })
        },
        getUserBookmark: ({dispatch, commit, state}, {uid, show, page, size = 48, tag, lang = 'zh', force}) => {
            const rest = show
            const limit = size;
            const offset = (page - 1) * size;
            const key = `用户${show}收藏：${uid} 第${page}页(${size}) tag:${tag}`
            return getCacheByTime({
                cacheObj: state.bookmark, key, force, seconds: 30 * 60,
                requestMethod: () => getUserBookmark({uid, rest, offset, limit, tag, lang})
            }).then(res => {
                const now = new Date().getTimeSeconds();
                const {authors, illusts} = res.data
                authors.forEach(author => commit('User/saveInfo2Cache', author, {root: true}))
                illusts.forEach(i => commit('Artworks/saveInfo2Cache', {key: `${i.id}`, value: {time: now, data: i}}, {root: true}))
                return {illusts: illusts.map(i => i.id), total: res.total}
            })
        },
        getUserBookmarkTags: ({dispatch, commit, state}, {uid, force}) => {
            return getCacheByTime({
                cacheObj: state.tags, key: `${uid}`, force, seconds: 60 * 60,
                requestMethod: () => getUserBookmarkTags(uid)
            })
        },
    },
    getters: {
        getUserFromCache: (state) => (uid) => {
            return state.cache[`${uid}`]
        },
    },
}