import {createStore} from 'vuex'
import Illust from "@/store/v2/Illust"
import User from "@/store/v2/User"
import Account from "@/store/v2/Account";
import Config from "@/store/v2/Config";
import IllustComment from "@/store/v2/IllustComment";
import Aria2 from "@/store/v2/Aria2";
import Novel from "@/store/v2/Novel";

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
        Illust, User, Account, Config, IllustComment, Aria2, Novel
    }, getters: {
        getApi(state) {
            return state.api;
        }
    },
})
