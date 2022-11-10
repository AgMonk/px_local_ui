// 评论
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {clearComments} from "@/assets/v2/comment-clear";

export default {
    namespaced: true, state: {
        //绘画评论缓存
        illusts: new Map(),
        //小说评论缓存
        novels: new Map(),
    }, mutations: {
        method(state, payload) {

        },
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //获取绘画根评论
        illustsRoots: ({dispatch, commit, state, rootGetters}, {force, pid, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illusts, force, key: pid + "_" + page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.illustsRoots(pid, page, 10, "zh").then(res => {
                        console.log(res)
                        clearComments(res.comments)
                        commit("User/updateBatch", res.comments, {root: true});
                        return res;
                    })
                }
            })
        },
        //获取小说根评论
        novelsRoots: ({dispatch, commit, state, rootGetters}, {force, nid, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novels, force, key: nid + "_" + page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.novelsRoots(nid, page, 10, "zh").then(res => {
                        console.log(res)
                        clearComments(res.comments)
                        commit("User/updateBatch", res.comments, {root: true});
                        return res;
                    })
                }
            })
        },
        //获取绘画评论楼中楼
        illustsReplies: ({dispatch, commit, state, rootGetters}, {force, commentId, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illusts, force, key: commentId + "_" + page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.illustsReplies(commentId, page, "zh").then(res => {
                        clearComments(res.comments)
                        commit("User/updateBatch", res.comments, {root: true});
                        return res;
                    })
                }
            })
        },
        //获取小说评论楼中楼
        novelsReplies: ({dispatch, commit, state, rootGetters}, {force, commentId, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novels, force, key: commentId + "_" + page, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.novelsReplies(commentId, page, "zh").then(res => {
                        clearComments(res.comments)
                        commit("User/updateBatch", res.comments, {root: true});
                        return res;
                    })
                }
            })
        },
        //发布评论
        comment: ({dispatch, commit, state, rootGetters}, {authorUserId, type, comment, stampId, parentId, worksType, id}) => {
            const params = {authorUserId, type, comment, stampId, parentId};
            //根据作品类型决定字段名
            if (worksType === 'illusts') {
                params.illustId = id;
            }
            if (worksType === 'novels') {
                params.novelId = id;
            }
            return rootGetters["getApi"].comments.comment(params)
        },
    }, getters: {},
}