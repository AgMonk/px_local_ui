// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {clearIllustDetail, clearIllustInfo} from "@/assets/v2/axios";

export default {
    namespaced: true,
    state: {
        latest: new Map(),
        detail: new Map(),
        search: new Map(),
        bookmarkData: new Map(),
        illustData: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
        updateIllust(state, info) {
            const {id} = info
            let cache = state.illustData.get(id);
            if (cache) {
                console.debug("更新作品数据:", info)
                state.illustData.set(id, Object.assign({}, cache, info))
            } else {
                console.debug("新作品:", info)
                state.illustData.set(id, info);
            }
        },
        updateBmkData(state, item) {
            console.debug("更新收藏数据:" + item.id)
            state.bookmarkData.set(Number(item.id), item.bookmarkData)
            item.bookmarked = !!item.bookmarkData
            delete item.bookmarkData;
        }
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        detail: ({dispatch, commit, state, rootGetters}, {pid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.detail,
                force, key: pid,
                seconds: 10 * 60,
                requestMethod: () => {
                    return rootGetters["getApi"].illustManga.detail(pid).then(item => {
                        //保存收藏数据
                        commit("updateBmkData", item);

                        clearIllustDetail(item)
                        //保存用户数据
                        commit("User/update", item.author, {root: true})
                        delete item.author

                        const {userIllustIds, userIllustsInfo, commissionFrom} = item
                        //保存用户作品id
                        if (userIllustIds) {
                            commit("User/updateProfile", {uid: item.userId, illusts: userIllustIds.reverse()}, {root: true})
                            delete item.userIllustIds
                        }
                        //保存用户其他作品info
                        if (userIllustsInfo) {
                            userIllustsInfo.forEach(i => {
                                commit("updateBmkData", i);
                                commit("updateIllust", i);
                            })
                            item.otherIllustIds = userIllustsInfo.map(i => i.id)
                            delete item.userIllustsInfo
                        }
                        commit("updateIllust", item)

                        //保存约稿用户信息
                        if (commissionFrom) {
                            commit("User/update", commissionFrom, {root: true})
                        }
                        return item
                    })
                }
            })
        },
        delBookmark: ({dispatch, commit, state, rootGetters}, {pid, bmkId}) => {
            return rootGetters["getApi"].bookmark.delIllust(bmkId).then(res => {
                state.bookmarkData.delete(pid)
                return res
            })
        },
        addBookmark: ({dispatch, commit, state, rootGetters}, pid) => {
            return rootGetters["getApi"].bookmark.addIllust({
                comment: "",
                tags: [],
                illust_id: pid,
                restrict: 0,
            }).then(id => {
                if (id) {
                    commit("updateBmkData", {id: pid, bookmarkData: {id: id, private: false}});
                    return id
                }
                return dispatch("bookmarkData", pid).then(res => {
                    return res.id
                })
            })
        },
        bookmarkData: ({dispatch, commit, state, rootGetters}, pid) => {
            return rootGetters["getApi"].illustManga.bookmarkData(pid).then(res => {
                state.bookmarkData.set(pid, res.bookmarkData)
                return res.bookmarkData;
            })
        },
        followLatest: ({dispatch, commit, state, rootGetters}, {force, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.latest,
                force, key: page,
                seconds: 10 * 60,
                requestMethod: () => {
                    return rootGetters["getApi"].illustManga.followLatest(page, "all", "zh").then(res => {
                        const {tagTranslation, thumbnails} = res
                        const {illust} = thumbnails
                        illust.forEach(item => {
                            //保存收藏数据
                            commit("updateBmkData", item);
                            clearIllustInfo(item)
                            //保存用户数据
                            commit("User/update", item.author, {root: true})
                            delete item.author
                            commit("updateIllust", item)
                        })
                        return {
                            data: illust.map(item => {
                                const {bookmarked, id, uid} = item
                                return {bookmarked, id, uid};
                            }), tagTranslation
                        }
                    })
                }
            })
        },
        search: ({dispatch, commit, state, rootGetters}, {keyword, params: {p, mode, scd, ecd}, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.search,
                force, key: JSON.stringify({keyword, p, mode, scd, ecd}),
                seconds: 10 * 60,
                requestMethod: () => {
                    return rootGetters["getApi"].illustManga.search(keyword, {
                        p, mode, scd, ecd,
                        order: 'date_d',
                        lang: 'zh',
                    }).then(res => {
                        const {illustManga, popular, relatedTags, tagTranslation, zoneConfig} = res

                        let handleIllusts = function (array) {
                            array.forEach(item => {
                                //保存收藏数据
                                commit("updateBmkData", item);
                                clearIllustInfo(item)
                                //保存用户数据
                                commit("User/update", item.author, {root: true})
                                delete item.author
                                commit("updateIllust", item)
                            })
                        }

                        handleIllusts(illustManga.data)
                        handleIllusts(popular.permanent)
                        handleIllusts(popular.recent)


                        delete res.extraData
                        delete res.illustManga.bookmarkRanges
                        delete res.zoneConfig
                        return res;
                    })
                }
            })
        },
    },
    getters: {
        getIllust: (state) => (id) => {
            return state.illustData.get(id)
        },
        getBookmarkData: (state) => (id) => {
            return state.bookmarkData.get(id)
        }
    },
}