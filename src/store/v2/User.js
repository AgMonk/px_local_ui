// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";

export default {
    namespaced: true,
    state: {
        user: new Map(),
        userData: new Map(),
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
            let cache = state.userData.get(id);
            if (cache) {
                console.debug("更新用户数据:", info)
                state.userData.set(id, Object.assign({}, cache, info))
            } else {
                console.debug("新用户:", info)
                state.userData.set(id, info);
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
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        userInfo: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.user,
                force,
                key: uid,
                seconds: 10 * 60,
                requestMethod: () => {
                    return rootGetters["getApi"].user.userInfo(uid, 1, "zh").then(res => {
                        res.avatar = res.image
                        res.avatarBig = res.imageBig
                        res.id = Number(res.userId)

                        delete res.image
                        delete res.imageBig
                        delete res.userId

                        commit("update", res)
                        return res
                    })
                }
            })
        },

    },
    getters: {
        getUser: (state) => (id) => {
            return state.userData.get(id)
        },
        getProfile: (state) => (id) => {
            return state.userProfile.get(id)
        },
    },
}