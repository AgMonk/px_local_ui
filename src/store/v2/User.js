// 
// noinspection JSUnusedLocalSymbols

import {CacheUtils} from "gin-utils/dist/utils/CacheUtils";

export default {
    namespaced: true, state: {
        //用户信息缓存
        user: new Map(),
        //用户作品概况缓存
        profile: new Map(),
        //用户插画缓存
        illusts: new Map(),
        //用户漫画缓存
        manga: new Map(),
        //用户小说缓存
        novels: new Map(),
        //用户
        userData: new Map(), //用户作品数据
        userProfile: new Map(),
    }, mutations: {
        method(state, payload) {

        },
        updateBatch(state, array) {
            array.forEach(item => {
                this.commit("User/update", item.author)
                delete item.author
            })
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
            manga && (cache.manga = manga);
            novels && (cache.novels = novels);
            pickup && (cache.pickup = pickup);
            mangaSeries && (cache.mangaSeries = mangaSeries);
            novelSeries && (cache.novelSeries = novelSeries);
            state.userProfile.set(uid, cache);
        }
    }, actions: {
        method: ({dispatch, commit, state, rootGetters}, payload) => {

        },
        //查询用户信息
        userInfo: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.user, force, key: uid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userApi.userInfo(uid, 1).then(res => {
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
                caches: state.profile, force, key: uid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.all(uid).then((res) => {
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
        // 查询用户插画/漫画
        profileIllusts: ({dispatch, commit, state, rootGetters}, {uid, ids, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.profile, force, key: uid + ids.join(','), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.illusts(uid, ids).then((res) => {
                        const array = Object.values(res.works)
                        commit("Illust/handleIllusts", {array}, {root: true})
                        return array.map(i => i.id).sort((a, b) => b - a)
                    })
                }
            })
        },
        // 用户小说使用的标签
        novelTags: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novels, force, key: "tags_" + uid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.novelTags(uid).then((res) => {
                        res.forEach(i => {
                            delete i.tag_yomigana
                        })
                        return res.sort((a, b) => b.cnt - a.cnt)
                    })
                }
            })
        },
        // 用户插画使用的标签
        illustTags: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illusts, force, key: "tags_" + uid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.illustTags(uid).then((res) => {
                        res.forEach(i => {
                            delete i.tag_yomigana
                        })
                        return res.sort((a, b) => b.cnt - a.cnt)
                    })
                }
            })
        },
        // 用户漫画使用的标签
        mangaTags: ({dispatch, commit, state, rootGetters}, {uid, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.manga, force, key: "tags_" + uid, seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.mangaTags(uid).then((res) => {
                        res.forEach(i => {
                            delete i.tag_yomigana
                        })
                        return res.sort((a, b) => b.cnt - a.cnt)
                    })
                }
            })
        },
        // 用户带有指定标签的小说
        novelsWithTag: ({dispatch, commit, state, rootGetters}, {uid, params, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.novels, force, key: uid + "_" + JSON.stringify(params), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.novelsWithTag(uid, params).then(({total, works}) => {
                        return {total, data: works, type: 'novel'}
                    })
                }
            })
        },
        // 用户带有指定标签的插画
        illustsWithTag: ({dispatch, commit, state, rootGetters}, {uid, params, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.illusts, force, key: uid + "_" + JSON.stringify(params), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.illustsWithTag(uid, params).then(({total, works}) => {
                        commit("Illust/handleIllusts", {array: works}, {root: true})
                        return {total, data: works, type: 'illust'}
                    })
                }
            })
        },
        // 用户带有指定标签的漫画
        mangasWithTag: ({dispatch, commit, state, rootGetters}, {uid, params, force}) => {
            return CacheUtils.getCacheByTime({
                caches: state.manga, force, key: uid + "_" + JSON.stringify(params), seconds: 30 * 60, requestMethod: () => {
                    return rootGetters["getApi"].userWorksApi.mangasWithTag(uid, params).then(({total, works}) => {
                        return {total, data: works, type: 'manga'}
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