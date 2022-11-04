// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";

export default {
    namespaced: true, state: {
        //用户信息缓存
        user: new Map(),
        //用户作品概况缓存
        profile: new Map(),
        //用户
        userData: new Map(), //用户作品数据
        userProfile: new Map(),
    }, mutations: {
        method(state, payload) {

        },
        //更新用户数据
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
        //更新用户作品概况
        updateProfile(state, {uid, illusts, manga, novels, pickup, mangaSeries, novelSeries}) {
            console.debug("更新用户作品概况:", uid)
            let cache = state.userProfile.get(uid);
            cache = cache || {illusts, manga, novels, pickup, mangaSeries, novelSeries}
            illusts && (cache.illusts = illusts);
            manga && (cache.illusts = manga);
            novels && (cache.illusts = novels);
            pickup && (cache.illusts = pickup);
            mangaSeries && (cache.illusts = mangaSeries);
            novelSeries && (cache.illusts = novelSeries);
            state.userProfile.set(uid, cache);
        }
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        }, userInfo: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.user, force, key: uid, seconds: 10 * 60, requestMethod: () => {
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
        //作品概况
        profileAll: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.profile, force, key: uid, seconds: 10 * 60, requestMethod: () => {
                    return rootGetters["getApi"].user.profileAll(uid, 'zh').then((res) => {
                        console.log(res)
                        let {illusts, manga, novels, pickup, mangaSeries, novelSeries} = res

                        illusts = Object.keys(illusts).map(i => Number(i)).sort((a, b) => b - a)
                        manga = Object.keys(manga).map(i => Number(i)).sort((a, b) => b - a)
                        novels = Object.keys(novels).map(i => Number(i)).sort((a, b) => b - a)

                        //处理 pickup
                        let pickupIllust = pickup.filter(i => i.hasOwnProperty('illustType'))
                        commit("Illust/handleIllusts", {array: pickupIllust}, {root: true})
                        let result = {illusts, manga, novels, pickup, mangaSeries, novelSeries}
                        commit("updateProfile", {uid, ...result})
                        return result
                    })
                }
            })
        },
    }, getters: {
        //获取用户数据
        getUser: (state) => (id) => {
            return state.userData.get(id)
        },
        //获取用户作品概况
        getProfile: (state) => (id) => {
            return state.userProfile.get(id)
        },
    },
}