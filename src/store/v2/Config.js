// 配置
// noinspection JSUnusedLocalSymbols


import {StorageUtils} from "gin-utils/dist/utils/StorageUtils";

const key = "config";

export default {
    namespaced: true,
    state: {
        //配置
        config: {
            //界面
            ui: {
                //搜索时,显示热门作品
                showPopular: false,
                //搜索时,显示相关标签
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
                userIdRules: [],
                //标题关键字
                titleKeywordsRules: [],
                //标签
                tagRules: [],
                //用户名关键字
                usernameKeywordsRules: [],
            },
        },
    },
    mutations: {
        loadConfig(state) {
            let config = StorageUtils.get(key);
            if (config) {
                state.config = config;
            } else {
                this.commit("Config/saveConfig")
            }
        },
        addBlock(state, {type, value}) {
            if (state.config.blocks.hasOwnProperty(type)) {
                state.config.blocks[type].push(value)
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