// 配置
// noinspection JSUnusedLocalSymbols

import {setCookies} from "@/assets/js/utils/CookieUtils";
import {getCache, putCache} from "@/assets/js/utils/StorageUtils";

export default {
    namespaced: true,
    state: {
        accounts: [],
        config: {
            token: "",
            //图片服务器
            domain: "/pxre",
        },
    },
    mutations: {
        method(state, payload) {

        },
        loadConfig(state) {
            state.config = getCache("config")
        },
        setAccounts(state, {cookies, token}) {
            setCookies(cookies, 30, "/pixiv-net")
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