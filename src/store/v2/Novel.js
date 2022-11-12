// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {clearNovel, clearNovelDetail, clearNovelInfo} from "@/assets/v2/novel-clear";
import {simplify} from "@/assets/v2/axios";
import {clearSeries, clearSeriesContent} from "@/assets/v2/novel-series-clear";

export default {
    namespaced: true,
    state: {
        //最新小说缓存
        latest: new Map(),
        //小说详情缓存
        detail: new Map(),
        //小说系列缓存
        series: new Map(),
        //小说各篇标题缓存
        seriesTitles: new Map(),
        //系列中作品的基础信息
        seriesContent: new Map(),
        // 收藏数据
        bookmarkData: new Map(),
        // 小说信息数据
        novelData: new Map(),

    },
    mutations: {
        method(state, payload) {

        },
        //处理单个小说数据
        handleNovel(state, item) {
            clearNovel(item)
            if (item.hasOwnProperty("content")) {
                clearNovelDetail(item)
            } else {
                clearNovelInfo(item)
            }
            //更新收藏数据
            this.commit("Novel/updateBmkData", item);
            //更新作者数据
            this.commit("User/update", item.author, {root: true})
            //更新小说数据
            this.commit("Novel/updateNovel", item)
        },
        //处理作品数组
        handleNovels(state, array) {
            array.forEach(item => this.commit('Novel/handleNovel', item))
        },
        //更新收藏数据
        updateBmkData(state, item) {
            console.debug("更新收藏数据:" + item.id)
            state.bookmarkData.set(Number(item.id), item.bookmarkData)
            item.bookmarked = !!item.bookmarkData
            delete item.bookmarkData;
        },
        //更新作品数据
        updateNovel(state, info) {
            const {id} = info
            let cache = state.novelData.get(id);
            if (cache) {
                console.debug("更新小说数据:", info)
                state.novelData.set(id, Object.assign({}, cache, info))
            } else {
                console.debug("新小说:", info)
                state.novelData.set(id, info);
            }
        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //最新小说
        followLatest: ({dispatch, commit, state, rootGetters}, {force, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.latest, force, key: page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.followLatest(page, "all", "zh").then(res => {
                        const data = res.thumbnails.novel;
                        commit("handleNovels", data);
                        return simplify(data)
                    })
                }
            })
        },
        //小说详情
        detail: ({dispatch, commit, state, rootGetters}, {force, nid}) => {
            return CacheUtils.getCacheByTime({
                caches: state.detail, force, key: nid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.detail(nid, "zh").then(res => {
                        commit("handleNovel", res)
                        commit("handleNovels", res.otherNovelsInfo)
                        return res
                    })
                }
            })
        },
        //小说系列
        series: ({dispatch, commit, state, rootGetters}, {force, seriesId}) => {
            return CacheUtils.getCacheByTime({
                caches: state.series, force, key: seriesId, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.series(seriesId, "zh").then(res => {
                        clearSeries(res)
                        return res
                    })
                }
            })
        },
        //查询系列中作品的基础信息
        seriesContent: ({dispatch, commit, state, rootGetters}, {force, seriesId, page, size,}) => {
            return CacheUtils.getCacheByTime({
                caches: state.seriesContent, force, key: `${seriesId}_${page}_${size}`, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.seriesContent(seriesId, page, size, "asc", 'zh').then(res => {
                        res.forEach(i => {
                            clearSeriesContent(i);
                            commit("updateBmkData", i);
                        })
                        return res
                    })
                }
            })
        },
        seriesTitles: ({dispatch, commit, state, rootGetters}, {force, seriesId}) => {
            return CacheUtils.getCacheByTime({
                caches: state.seriesTitles, force, key: seriesId, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].novel.seriesTitles(seriesId, "zh").then(res => {
                        res.forEach(i => {
                            // noinspection JSValidateTypes
                            i.id = Number(i.id)
                        })
                        return res
                    })
                }
            })
        },
        //删除收藏
        delBookmark: ({dispatch, commit, state, rootGetters}, {nid, bmkId}) => {
            return rootGetters["getApi"].bookmark.delNovel(bmkId).then(res => {
                state.bookmarkData.delete(nid)
                return res
            })
        },
        //添加收藏
        addBookmark: ({dispatch, commit, state, rootGetters}, nid) => {
            return rootGetters["getApi"].bookmark.addNovel({
                comment: "", tags: [], novel_id: nid, restrict: 0,
            }).then(id => {
                if (id) {
                    commit("updateBmkData", {id: nid, bookmarkData: {id: id, private: false}});
                    return id
                }
                return dispatch("bookmarkData", nid).then(res => {
                    return res.id
                })
            })
        },
        //查询收藏数据
        bookmarkData: ({dispatch, commit, state, rootGetters}, nid) => {
            return rootGetters["getApi"].novel.bookmarkData(nid).then(res => {
                state.bookmarkData.set(nid, res.bookmarkData)
                return res.bookmarkData;
            })
        },

    },
    getters: {
        //获取小说数据
        getNovel: (state) => (id) => {
            return state.novelData.get(id)
        },
        //获取收藏数据
        getBookmarkData: (state) => (id) => {
            return state.bookmarkData.get(id)
        }
    },
}