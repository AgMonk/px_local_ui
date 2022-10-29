import {createStore} from 'vuex'
import Illust from "@/store/v2/Illust"
import User from "@/store/v2/User"
import Account from "@/store/v2/Account";
import Config from "@/store/v2/Config";

export default createStore({
    state: {
        api: undefined,
    },
    mutations: {
        setApi(state, api) {
            state.api = api;
        }
    },
    actions: {},
    modules: {
        Illust, User, Account, Config
    }, getters: {
        getApi(state) {
            return state.api;
        }
    },
})
