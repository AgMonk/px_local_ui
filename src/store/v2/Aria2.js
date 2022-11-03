// 
// noinspection JSUnusedLocalSymbols

import {Aria2} from "aria2-api"
import axios from "axios";

export default {
    namespaced: true,
    state: {
        api: new Aria2(axios.create({baseURL: '/aria2', timeout: 10000}))
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        getVersion: ({dispatch, commit, state, rootGetters},) => {
            return state.api.getVersion()
        },

    },
    getters: {},
}