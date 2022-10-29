// 
// noinspection JSUnusedLocalSymbols

export default {
    namespaced: true,
    state: {
        user: new Map(),
        //用户作品数据
        userProfile: new Map(),
    },
    mutations: {
        method(state, payload) {

        },
        update(state, info) {
            const {id} = info
            info.name = info.name.split("@")[0]
            info.name = info.name.split("＠")[0]
            let cache = state.user.get(id);
            if (cache) {
                console.debug("更新用户数据:", info)
                state.user.set(id, Object.assign({}, cache, info))
            } else {
                console.debug("新用户:", info)
                state.user.set(id, info);
            }
        },
        updateProfile(state, {uid, illusts, novels}) {
            console.debug("更新用户作品概况:", uid)
            let cache = state.userProfile.get(uid);
            cache = cache || {illusts, novels}
            illusts && (cache.illusts = illusts);
            novels && (cache.illusts = novels);
            state.userProfile.set(uid, cache);
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {
        getUser: (state) => (id) => {
            return state.user.get(id)
        },
        getProfile: (state) => (id) => {
            return state.userProfile.get(id)
        },
    },
}