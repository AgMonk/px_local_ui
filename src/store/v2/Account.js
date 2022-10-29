// 
// noinspection JSUnusedLocalSymbols

import {Api} from "pixiv-web-api-for-browser/dist";
import {StorageUtils} from "gin-utils/dist/utils/StorageUtils";
import {instance, PIXIV_PATH} from "@/assets/js/axios";

const key = "accounts";
export default {
    namespaced: true,
    state: {
        current: undefined,
        accounts: [],
    },
    mutations: {
        loadAccount(state) {
            let accounts = StorageUtils.get(key);
            accounts = accounts || {current: undefined, accounts: [],};
            state.current = accounts.current;
            state.accounts = accounts.accounts;
        },
        saveAccounts(state) {
            const {accounts, current} = state
            StorageUtils.put(key, {accounts, current})
        },
        changeCurrent(state, uid) {
            state.current = uid;
            const account = state.accounts.filter(item => item.uid === uid)[0]
            Api.setCookie(account.cookie, PIXIV_PATH)
            this.commit("setApi", new Api(instance, account.token), {root: true})
            this.commit("Account/saveAccounts")
        },
        logout(state, uid) {
            state.accounts = state.accounts.filter(item => item.uid !== uid)
            state.current = state.current === uid ? undefined : state.current;
            Api.clearCookie(PIXIV_PATH)
            this.commit("Account/saveAccounts")
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        login: ({dispatch, commit, state, rootGetters}, phpSessionId) => {
            const [uid] = phpSessionId.split("_")
            Api.setCookie(phpSessionId, PIXIV_PATH)
            return new Api(instance).fetchToken().then(data => {
                state.accounts = state.accounts || []
                const {userData} = data
                const uid = Number(userData.id)
                const name = userData.name
                const cookie = phpSessionId;
                const token = data.token
                const avatar = userData.profileImgBig
                state.accounts = state.accounts.filter(item => item.uid !== uid)
                state.accounts.push({
                    uid, name, cookie, token, avatar
                })
                state.current = uid;
                commit("saveAccounts")
                commit("setApi", new Api(instance, token), {root: true})
                return userData;
            })
        },
    },
    getters: {
        getCurrent(state) {
            return state.accounts.filter(i => i.uid === state.current)[0]
        }
    },
}