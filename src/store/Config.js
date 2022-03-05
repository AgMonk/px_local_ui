// 配置
// noinspection JSUnusedLocalSymbols

import {setCookies} from "@/assets/js/utils/CookieUtils";
import {getCache, putCache} from "@/assets/js/utils/StorageUtils";
import {ElMessage} from "element-plus";

export default {
    namespaced: true,
    state: {
        accounts: [],
        config: {
            uid: 0,
            token: "",
            //图片服务器
            domain: "/pxre",
            //显示作品卡片时，缓存该作品详情（可以显示出收藏数）
            detail: false,
            //过滤器
            filter: {
                uid: [],
                //作品标题关键字屏蔽
                title: [],
                //作者名称关键字屏蔽
                username: [],
            },
        },
    },
    mutations: {
        method(state, payload) {

        },
        addFilter(state, {key, value}) {
            state.config.filter[key].push(value)
            ElMessage.success("添加成功")
            putCache("config", state.config)
        },
        delFilter(state, {key, value}) {
            state.config.filter[key] = state.config.filter[key].filter(i => i !== value)
            ElMessage.success("移除成功")
            putCache("config", state.config)
        },
        loadConfig(state) {
            state.config = Object.assign({}, state.config, getCache("config"))
        },
        setAccounts(state, {cookies, token}) {
            setCookies(cookies, 30, "/pixiv-net")
            const pattern = /PHPSESSID=(\d+)/
            const group = pattern.exec(cookies)
            state.config.uid = Number(group[1]);
            state.config.token = token;
            putCache("config", state.config)
        },
        setConfig(state, {key, value}) {
            state.config[key] = value;
            putCache("config", state.config)
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {
        isFilterExists: (state) => (key, value) => {
            const filter = state.config.filter;
            return filter.hasOwnProperty(key) && filter[key].includes(value)
        }
    },
}