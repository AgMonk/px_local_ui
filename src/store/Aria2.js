// Aria2管理模块
// noinspection JSUnusedLocalSymbols

import {addTask, deleteQuest, getPixivUrls, tellStop} from "@/assets/js/request/aria2";

export default {
    namespaced: true,
    state: {
        query: [],
        downloading: [],
        deleteQuery:[],
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
            if (gid){
                deleteQuest(gid).then(res=>{
                    state.deleteQuery.splice(0,1)
                    dispatch('deleteQuest')
                })
            }
        },
        checkCompleted: ({dispatch, commit, state}) => {
            let count = 0;
            tellStop().then(res=>{
                res.forEach(item=>{
                    const {gid,status} = item
                    if (state.downloading.includes(gid) && status==='complete'){
                        state.downloading = state.downloading.filter(i=>i!==gid)
                        state.deleteQuery.push(gid)
                        count++;
                    }else{
                        console.log(state.downloading.includes(gid))
                        console.log(status==='complete')
                    }
                })
                if (count>0){
                    dispatch("deleteQuest")
                }
            })

        },
        addFirst: ({dispatch, commit, state}) => {
            const param = state.query[0]
            if (param) {
                dispatch("addTask", param).then(res => {
                    state.query.splice(0, 1)
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
                state.query.push({url, count: i})
            }
            return null;
        },
    },
    getters: {},
}