// 配置
// noinspection JSUnusedLocalSymbols

import {setCookies} from "@/assets/js/utils/CookieUtils";
import {getCache, putCache} from "@/assets/js/utils/StorageUtils";

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
            //不显示已收藏的卡片（在“我的收藏”页无效）
            filterBookmarked: false,
        },
    },
    mutations: {
        method(state, payload) {

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
    getters: {},
}