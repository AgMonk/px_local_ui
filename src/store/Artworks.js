// 作品详情
// noinspection JSUnusedLocalSymbols

import {bookmarkAdd, bookmarkDel, getIllustInfo} from "@/assets/js/request/illust";
import {copyObj} from "@/assets/js/utils/ObjUtils";
import {ElMessage} from "element-plus";
import {getUserProfileIllust} from "@/assets/js/request/user";

export default {
    namespaced: true,
    state: {
        artworks: [],
        cache: {},
    },
    mutations: {
        method(state, payload) {

        },
        addTab(state, {id, title}) {
            state.artworks.push({id, title})
        },
        delTab(state, id) {
            state.artworks = state.artworks.filter(i => i.id !== id)
        },
        delAllTabs(state) {
            state.artworks = []
        },
        saveInfo2Cache(state, {key, value}) {
            //如果缓存不存在 或者 value的层级更高
            if (!state.cache[key] || value.data.level === '详情') {
                state.cache[key] = value;
            }
        },

    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        bookmarkAdd: ({dispatch, commit, state}, {pid, token}) => {
            return bookmarkAdd(pid, token).then(res => {
                const {bookmarkId, statusId} = res
                state.cache[`${pid}`].data.bmkData = {
                    id: bookmarkId,
                    private: false
                }
                return bookmarkId;
            })
        },
        bookmarkDel: ({dispatch, commit, state}, {pid, id, token}) => {
            return bookmarkDel(id, token).then(res => {
                delete state.cache[`${pid}`].data.bmkData
            }).catch(reason => {
                const {status, message} = reason
                if (status === 404) {
                    ElMessage.error(`${status}: ${message}`)
                    delete state.cache[`${pid}`].data.bmkData
                } else {
                    throw reason
                }
            })
        },
        getIllustInfo: ({dispatch, commit, state}, {pid, force, levels = ['详情']}) => {
            const now = new Date().getTimeSeconds();
            const key = `${pid}`;
            const cache = state.cache[key];
            if (!force && cache && cache.time > now - 60 * 30 && levels.includes(cache.data.level)) {
                console.log("从缓存读取数据 " + key)
                const data = copyObj(cache.data)
                // console.log(data)
                return new Promise((r) => r(data))
            }
            return getIllustInfo(pid).then(res => {
                const {illust, author, userIllusts} = res
                console.log(res)

                commit("saveInfo2Cache", {key, value: {time: now, data: illust}});
                userIllusts.forEach(i => commit("saveInfo2Cache", {key: `${i.id}`, value: {time: now, data: i}}))
                commit('User/saveInfo2Cache', author, {root: true})
                if (res.commssionFrom) {
                    commit('User/saveInfo2Cache', res.commssionFrom, {root: true})
                }
                // console.log(state.cache)
                return illust
            })
        },
        getUserProfileIllust: ({dispatch, commit, state}, {uid, page, data, type, lang = 'zh', is_first_page}) => {
            const ids = data.filter(id => !Object.keys(state.cache).includes(`${id}`));
            if (ids.length === 0) {
                return new Promise((r) => r({}))
            }
            const now = new Date().getTimeSeconds();
            return getUserProfileIllust({uid, ids, type, is_first_page, lang}).then(res => {
                console.log(res)
                res.forEach(i => commit("saveInfo2Cache", {key: `${i.id}`, value: {time: now, data: i}}))
                return {}
            })
        },

    },
    getters: {
        getIllustFromCache: (state) => (pid) => {
            return state.cache[`${pid}`].data
        },
    },
}