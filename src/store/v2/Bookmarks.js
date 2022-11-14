// 收藏查询
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {simplify} from "@/assets/v2/axios";

const sortUserTag = function (array) {
    array.sort((a, b) => {
        if (a.tag === '未分類') {
            return -1;
        }
        return b.cnt - a.cnt
    })
}

export default {
    namespaced: true,
    state: {
        //收藏绘画缓存
        illust: new Map(),
        //收藏小说缓存
        novel: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //查询用户收藏的绘画
        illust: ({dispatch, commit, state, rootGetters}, {force, uid, param: {page, size, tag, rest}}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illust, force, key: JSON.stringify({uid, page, size, tag, rest}), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].user.illustsBookmarks(uid, {page, size, tag, rest}).then(res => {
                        const {total, works} = res
                        commit("Illust/handleIllusts", {array: works}, {root: true})
                        return {
                            total, data: simplify(works), type: 'illust',
                        }
                    })
                }
            })
        },
        //查询用户收藏的绘画中的标签
        illustTag: ({dispatch, commit, state, rootGetters}, {force, uid}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illust, force, key: uid + "_tag", seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].user.illustsBookmarkTags(uid).then(res => {
                        const hide = res.private
                        const show = res.public
                        sortUserTag(hide)
                        sortUserTag(show)
                        return {show, hide};
                    })
                }
            })
        },
        //查询用户收藏的小说
        novel: ({dispatch, commit, state, rootGetters}, {force, uid, param: {page, size, tag, rest}}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novel, force, key: JSON.stringify({uid, page, size, tag, rest}), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].user.novelsBookmarks(uid, {page, size, tag, rest}).then(res => {
                        const {total, works} = res
                        commit("Novel/handleNovels", works, {root: true})
                        return {
                            total, data: simplify(works), type: 'novel',
                        }
                    })
                }
            })
        },
        //查询用户收藏的小说中的标签
        novelTag: ({dispatch, commit, state, rootGetters}, {force, uid}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novel, force, key: uid + "_tag", seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].user.novelsBookmarkTags(uid).then(res => {
                        const hide = res.private
                        const show = res.public
                        sortUserTag(hide)
                        sortUserTag(show)
                        return {show, hide};
                    })
                }
            })
        },

    },
    getters: {},
}