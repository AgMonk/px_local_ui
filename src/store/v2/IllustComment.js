// 绘画评论区
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {emoji} from "@/assets/js/emoji";

export default {
    namespaced: true, state: {
        //根评论
        roots: new Map(), //楼中楼
        replies: new Map(),
    }, mutations: {
        method(state, payload) {

        },
        handleComments(state, comments) {
            comments.forEach(item => {
                item.id = Number(item.id)
                item.userId = Number(item.userId)
                item.commentUserId = Number(item.commentUserId)
                item.commentRootId && (item.commentRootId = Number(item.commentRootId))
                item.commentParentId && (item.commentParentId = Number(item.commentParentId))
                //保存用户数据
                this.commit("User/update", {avatar: item.img, name: item.userName, id: Number(item.userId)}, {root: true})

                //替换回复中的emoji为img标签
                if (item.comment) {
                    const pattern = /\((.+?)\)/g
                    let matcher = undefined;
                    while (matcher = pattern.exec(item.comment)) {
                        let s = matcher[0]
                        let key = matcher[1]
                        if (emoji.hasOwnProperty(key)) {
                            item.comment = item.comment.replace(s, `<img style="width: 30px" src="https://s.pximg.net/common/images/emoji/${emoji[key]}.png" alt=""/>`)
                        }
                    }
                }
                delete item.userName;
                delete item.img;
            })
        },
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        delComment: ({dispatch, commit, state, rootGetters}, {commentId, pid}) => {
            return rootGetters["getApi"].comments.delComment(pid, commentId).then(() => {
                //清理root
                [...state.roots.keys()].filter(key => key.startsWith(pid + "_")).forEach(key => state.roots.delete(key));
                //清理replies
                state.replies.clear();
            })
        },
        illustsRoots: ({dispatch, commit, state, rootGetters}, {force, pid, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.roots, force, key: pid + "_" + page, seconds: 10 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.illustsRoots(pid, page, 10, "zh").then(res => {
                        const {comments} = res
                        commit("handleComments", comments)
                        console.log(res)
                        return res;
                    })
                }
            })
        },
        illustsReplies: ({dispatch, commit, state, rootGetters}, {force, commentId, page}) => {
            return CacheUtils.getCacheByTime({
                caches: state.replies, force, key: commentId + "_" + page, seconds: 10 * 60, requestMethod: () => {
                    return rootGetters["getApi"].comments.illustsReplies(commentId, page, "zh").then(res => {
                        const {comments} = res
                        commit("handleComments", comments)
                        console.log(res)
                        return res;
                    })
                }
            })
        },


    }, getters: {},
}