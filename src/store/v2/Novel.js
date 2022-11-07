// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {clearNovelInfo} from "@/assets/v2/novel-clear";
import {simplify} from "@/assets/v2/axios";

export default {
    namespaced: true,
    state: {
        //最新小说缓存
        latest: new Map(),
        // 收藏数据
        bookmarkData: new Map(),
        // 小说信息数据
        novelData: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
        //处理单个小说数据
        handelNovel(state, item) {
            clearNovelInfo(item)
            //更新收藏数据
            this.commit("Novel/updateBmkData", item);
            //更新作者数据
            this.commit("User/update", item.author, {root: true})
            //更新小说数据
            this.commit("Novel/updateNovel", item)
        },
        //处理作品数组
        handleNovels(state, array) {
            array.forEach(item => this.commit('Novel/handelNovel', item))
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
    },
    getters: {},
}