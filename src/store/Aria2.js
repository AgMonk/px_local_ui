// Aria2管理模块
// noinspection JSUnusedLocalSymbols

import {addTask, getPixivUrls} from "@/assets/js/request/aria2";

export default {
    namespaced: true,
    state: {
        query: [],
        downloading: [],
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        addFirst: ({dispatch, commit, state}) => {
            const param = state.query[0]
            if (param){
                dispatch("addTask",param).then(res => {
                    state.query.splice(0,1)
                    dispatch("addFirst")
                })
            }
        },
        addTask: ({dispatch, commit, state}, {url, count}) => {
            return addTask({urls: getPixivUrls(url, count)}).then(res => {
                state.downloading.push(res)
            })
        },
        addQuery: ({dispatch, commit, state}, {url, count}) => {
            for (let i = 0; i < count; i++) {
                state.query.push({url,count:i})
            }
            return null;
        },
    },
    getters: {},
}