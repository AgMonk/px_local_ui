// 配置
// noinspection JSUnusedLocalSymbols


import {StorageUtils} from "gin-utils/dist/utils/StorageUtils";

const key = "config";

export default {
    namespaced: true,
    state: {
        //配置
        config: {},
    },
    mutations: {
        loadConfig(state) {
            state.config = StorageUtils.get(key);
            if (!state.config) {
                state.config = {
                    //界面
                    ui: {
                        //显示热门作品
                        showPopular: false,
                        //显示相关标签
                        showRelatedTags: false,
                        //将已收藏作品分组显示
                        groupBookmarked: true,
                        //作品卡片的图片大小
                        cardSize: 150,
                    },
                    //行为
                    behavior: {
                        //加载卡片时，缓存它的详情数据
                        requestCardDetail: false,
                    },
                    //屏蔽
                    blocks: {
                        //uid屏蔽
                        uid: [],
                        //标题关键字
                        title: [],
                        //标签
                        tags: [],
                        //用户名关键字
                        username: [],
                    },
                }
                this.commit("Config/saveConfig")
            }
        },
        updateConfig(state, config) {
            state.config = config;
            this.commit("Config/saveConfig")
        },
        saveConfig(state) {
            StorageUtils.put(key, state.config);
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}