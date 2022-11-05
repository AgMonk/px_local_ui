// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {clearIllustDetail, clearIllustInfo, handleTagTranslation, translateTagList} from "@/assets/v2/axios";

/**
 * 精简作品的字段
 * @param array
 * @returns {*}
 */
const simplify = (array) => {
    return array.map(item => {
        return {
            id: item.id, uid: item.uid,
        }
    })
}

export default {
    namespaced: true, state: {
        // 最新作品缓存
        latest: new Map(),
        // 详情缓存
        detail: new Map(),
        // 搜索缓存
        search: new Map(),
        // 收藏数据
        bookmarkData: new Map(),
        // 作品信息数据
        illustData: new Map(),
    }, mutations: {
        method(state, payload) {

        },
        //处理单个作品
        handleIllust(state, {item, dic}) {
            //保存收藏数据
            this.commit("Illust/updateBmkData", item);
            clearIllustInfo(item)
            if (dic) {
                item.tagList = item.tagList.map(i => translateTagList(dic, i))
            }
            //保存用户数据
            this.commit("User/update", item.author, {root: true})
            this.commit("Illust/updateIllust", item)
            delete item.author
        },
        //处理作品数组
        handleIllusts(state, {array, dic}) {
            array.forEach(item => this.commit('Illust/handleIllust', {item, dic}))
        },
        //更新作品数据
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
        //更新收藏数据
        updateBmkData(state, item) {
            console.debug("更新收藏数据:" + item.id)
            state.bookmarkData.set(Number(item.id), item.bookmarkData)
            item.bookmarked = !!item.bookmarkData
            delete item.bookmarkData;
        }
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //请求作品详情
        detail: ({dispatch, commit, state, rootGetters}, {pid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.detail, force, key: pid, seconds: 30 * 60, requestMethod: () => {
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
        //删除收藏
        delBookmark: ({dispatch, commit, state, rootGetters}, {pid, bmkId}) => {
            return rootGetters["getApi"].bookmark.delIllust(bmkId).then(res => {
                state.bookmarkData.delete(pid)
                return res
            })
        },
        //添加收藏
        addBookmark: ({dispatch, commit, state, rootGetters}, pid) => {
            return rootGetters["getApi"].bookmark.addIllust({
                comment: "", tags: [], illust_id: pid, restrict: 0,
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
        //查询收藏数据
        bookmarkData: ({dispatch, commit, state, rootGetters}, pid) => {
            return rootGetters["getApi"].illustManga.bookmarkData(pid).then(res => {
                state.bookmarkData.set(pid, res.bookmarkData)
                return res.bookmarkData;
            })
        },
        //最新绘画
        followLatest: ({dispatch, commit, state, rootGetters}, {force, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.latest, force, key: page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].illustManga.followLatest(page, "all", "zh").then(res => {
                        handleTagTranslation(res)
                        const {tagTranslation, thumbnails} = res
                        const {illust} = thumbnails
                        commit("handleIllusts", {array: illust, dic: tagTranslation})
                        return {
                            data: simplify(illust), tagTranslation
                        }
                    })
                }
            })
        },
        //搜索
        search: ({dispatch, commit, state, rootGetters}, {keyword, params: {p, mode, scd, ecd}, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.search, force, key: JSON.stringify({keyword, p, mode, scd, ecd}), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].illustManga.search(keyword, {
                        p, mode, scd, ecd, order: 'date_d', lang: 'zh',
                    }).then(res => {
                        handleTagTranslation(res)
                        const {illustManga, popular, relatedTags, tagTranslation, zoneConfig} = res

                        commit("handleIllusts", {array: illustManga.data, dic: tagTranslation})
                        commit("handleIllusts", {array: popular.permanent, dic: tagTranslation})
                        commit("handleIllusts", {array: popular.recent, dic: tagTranslation})

                        const data = simplify(illustManga.data)
                        const total = illustManga.total
                        const permanent = simplify(popular.permanent)
                        const recent = simplify(popular.recent)

                        return {
                            data, total, popular: {permanent, recent}, relatedTags, tagTranslation
                        };
                    })
                }
            })
        },
    }, getters: {
        getIllust: (state) => (id) => {
            return state.illustData.get(id)
        }, getBookmarkData: (state) => (id) => {
            return state.bookmarkData.get(id)
        }
    },
}