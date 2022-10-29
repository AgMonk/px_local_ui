// 发现
// noinspection JSUnusedLocalSymbols

import {discover} from "@/assets/js/request/discover";
import {distinctById} from "@/assets/js/utils/ObjUtils";

export default {
    namespaced: true,
    state: {
        illusts: [],
    },
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        clear: ({dispatch, commit, state}) => {
            state.illusts = []
            return dispatch('discover', {limit: 60})
        },
        discover: ({dispatch, commit, state}, {limit, id}) => {
            return discover({
                limit, sampleIllustId: id
            }).then(res => {
                const {authors, recommended, illusts, tags} = res
                const now = Math.floor(new Date().getTime() / 1000)

                authors.forEach(author => commit('User/saveInfo2Cache', author, {root: true}))
                illusts.forEach(i => commit('Artworks/saveInfo2Cache', {key: `${i.id}`, value: {time: now, data: i}}, {root: true}))

                state.illusts.push(...recommended)
                state.illusts = distinctById(state.illusts)
                state.illusts.sort((a, b) => b.score - a.score)

                return recommended.map(i => i.id)
            })
        },
    },
    getters: {},
}