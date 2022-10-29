// Aria2管理模块
// noinspection JSUnusedLocalSymbols

import {addTask, deleteQuest, getPixivUrlsParams, tellStop} from "@/assets/js/request/aria2";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        query: [],
        downloading: [],
        deleteQuery: [],
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        deleteQuest: ({dispatch, commit, state}) => {
            const gid = state.deleteQuery[0]
            if (gid) {
                deleteQuest(gid).then(res => {
                    state.deleteQuery.splice(0, 1)
                    dispatch('deleteQuest')
                })
            }
        },
        checkCompleted: ({dispatch, commit, state}) => {
            if (state.downloading.length === 0) {
                return;
            }
            let count = 0;
            tellStop().then(res => {
                res.forEach(item => {
                    const {gid, status} = item
                    if (state.downloading.includes(gid) && status === 'complete') {
                        state.downloading = state.downloading.filter(i => i !== gid)
                        state.deleteQuery.push(gid)
                        count++;
                    } else {
                    }
                })
                if (count > 0) {
                    dispatch("deleteQuest")
                }
            })

        },
        downloadIllust({dispatch, commit, state}, {data, dir}) {
            console.log(data)
            const url = data.type === 2 ? data.urls.zip : data.urls.original
            const count = data.counts.page
            for (let i = 0; i < count; i++) {
                const param = getPixivUrlsParams(url, i, dir, data.id);
                dispatch('startDownload', param)
            }
        },
        startDownload: ({dispatch, commit, state}, param) => {
            if (!param) {
                return
            }
            const id = param.id
            return addTask(param).then(gid => {
                state.downloading.push(gid)
                ElMessage.success(`${id} 开始下载`)
            }).catch(reason => autoRetry(reason, () => dispatch('startDownload', param)))
        },
    },
    getters: {},
}