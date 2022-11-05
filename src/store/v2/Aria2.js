// 
// noinspection JSUnusedLocalSymbols

import {Aria2} from "aria2-api"
import axios from "axios";
import {ElMessage, ElNotification} from "element-plus";
import {Aria2Method} from "aria2-api/dist/src/Aria2Method";

export default {
    namespaced: true,
    state: {
        //api
        api: new Aria2(axios.create({baseURL: '/aria2', timeout: 5000})),
        //由本UI添加的任务 gid
        gidList: [],
        //周期检查任务状态
        interval: undefined,
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        init: ({dispatch, commit, state, rootGetters}, payload) => {
            if (state.interval) {
                clearInterval(state.interval)
            }
            state.interval = setInterval(() => {
                state.api.tellStop(1, 100).then(res => {
                    //完成任务
                    let completed = res
                        .filter(i => state.gidList.includes(i.gid))
                        .filter(i => i.status === 'complete')
                        .map(i => {
                            const {gid, files} = i
                            let path = files[0].path.split("/");
                            let filename = path[path.length - 1]
                            return {gid, filename}
                        })

                    if (completed.length > 0) {
                        state.api.removeDownloadResult(completed[0].gid).then(res => {
                            ElNotification({
                                title: '任务完成',
                                message: completed[0].filename + " 下载完成",
                                type: 'success',
                                position: 'bottom-right',
                            })
                        })
                    }
                })
            }, 10000)
        },
        //添加任务
        addUri: ({dispatch, commit, state, rootGetters}, {url, dir}) => {
            return state.api.addUri([url], {dir, referer: "*"}).then(res => {
                state.gidList.push(res)
                ElMessage.success("任务添加成功")
                return res
            })
        },
        //批量添加任务
        addUris: ({dispatch, commit, state, rootGetters}, {urls, dir}) => {
            const methodName = Aria2Method.ADD_URI;
            const params = urls.map(url => {
                return {
                    methodName, params: [[url], {dir, referer: "*"}],
                }
            })
            return state.api.multiCall(params).then(res => {
                const gid = res.flatMap(i => i)
                ElMessage.success(`成功添加 ${urls.length} 个任务`)
                state.gidList.push(...gid)
                return gid
            })
        },
        getVersion: ({dispatch, commit, state, rootGetters},) => {
            return state.api.getVersion()
        },


    },
    getters: {},
}