// 绘画评论区
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";
import {emoji} from "@/assets/v2/emoji";
import {DateUtils} from "gin-utils/dist/utils/DateUtils";

//处理发表回复的响应
function handleCommentRes(res) {
    const {comment, comment_id, parent_id, stamp_id, user_id} = res
    //获得当前时区偏移
    let offset = 540 + new Date().getTimezoneOffset()
    let date = DateUtils.plusMinutes(new Date(), offset);
    return {
        comment,
        id: Number(comment_id),
        commentParentId: Number(parent_id),
        stampId: stamp_id,
        userId: Number(user_id),
        editable: true,
        commentDate: DateUtils.format(date, "yyyy-MM-dd hh:mm"),
    }
}

export default {
    namespaced: true,
    state: {
        //根评论
        roots: new Map(), //楼中楼
        replies: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
        handleComments(state, comments) {
            if (!comments) {
                return;
            }
            comments.forEach(item => {
                item.id = Number(item.id)
                item.userId = Number(item.userId)
                item.commentUserId = Number(item.commentUserId)
                item.commentRootId && (item.commentRootId = Number(item.commentRootId))
                item.commentParentId && (item.commentParentId = Number(item.commentParentId))
                item.replyToUserId && (item.replyToUserId = Number(item.replyToUserId))
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
                            item.comment = item.comment.replace(s, `<img style="width: 50px" src="https://s.pximg.net/common/images/emoji/${emoji[key]}.png" alt=""/>`)
                        }
                    }
                }
                delete item.userName;
                delete item.img;
                delete item.replyToUserName;
                delete item.stampLink;
            })
        },
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        commentStamp: ({dispatch, commit, state, rootGetters}, {illustId, authorUserId, stampId, parentId}) => {
            return rootGetters["getApi"].comments.commentStamp(illustId, authorUserId, stampId, parentId).then(res => {
                return handleCommentRes(res);
            })
        },
        commentText: ({dispatch, commit, state, rootGetters}, {illustId, authorUserId, text, parentId}) => {
            return rootGetters["getApi"].comments.commentText(illustId, authorUserId, text, parentId).then(res => {
                return handleCommentRes(res);
            })
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