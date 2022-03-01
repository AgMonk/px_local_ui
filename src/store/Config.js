// 配置
// noinspection JSUnusedLocalSymbols

import {setCookies} from "@/assets/js/utils/CookieUtils";
import {putCache} from "@/assets/js/utils/StorageUtils";

export default {
    namespaced: true,
    state: {
        accounts:[],
        config:{
            token:"",
        },
    },
    mutations: {
        method(state, payload) {

        },
        setAccounts(state, {cookies,token}) {
            setCookies(cookies,30,"/pixiv-net")
            state.config.token = token;
            putCache("config",state.config)
        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}