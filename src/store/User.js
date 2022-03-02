// Pixiv用户信息
// noinspection JSUnusedLocalSymbols

export default {
    namespaced: true,
    state: {
        cache:{}
    },
    mutations: {
        method(state, payload) {

        },
        saveInfo2Cache(state, value) {
            const k = `${value.id}`
            state.cache[k] = Object.assign({},state.cache[k],value)
            // console.log(state.cache[k])
        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}