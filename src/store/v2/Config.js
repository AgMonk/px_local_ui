// 配置
// noinspection JSUnusedLocalSymbols


import {StorageUtils} from "gin-utils/dist/utils/StorageUtils";

const key = "config";

export default {
    namespaced: true, state: {
        //配置
        config: {
            //界面
            ui: {
                //搜索时,显示相关标签
                showRelatedTags: false,
                //将已收藏作品分组显示
                groupBookmarked: true,
                //作品卡片的大小
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
                userIdRules: [], //标题关键字
                titleKeywordsRules: [], //标签
                tagRules: [], //用户名关键字
                usernameKeywordsRules: [],
            },
            //aria2配置
            aria2: {
                //下载根目录
                homePath: undefined
            },
            //保存的搜索
            search: {
                illust: [],
                novel: [],
            }
        },
    }, mutations: {
        addSearch(state, {type, data: {title, command}}) {
            const config = state.config;
            config.search[type] = config.search[type].filter(i => i.title !== title)
            config.search[type].push({title, command})
            config.search[type].sort((a, b) => a.title.localeCompare(b.title))
            this.commit("Config/saveConfig")
        },
        loadConfig(state) {
            let config = StorageUtils.get(key);
            if (config) {
                state.config = Object.assign({}, state.config, config);
            }
            this.commit("Config/saveConfig")
        }, addBlock(state, {type, value}) {
            if (state.config.blocks.hasOwnProperty(type)) {
                state.config.blocks[type].push(value)
                this.commit("Config/saveConfig")
            }
        }, updateConfig(state, config) {
            state.config = config;
            this.commit("Config/saveConfig")
        }, saveConfig(state) {
            StorageUtils.put(key, state.config);
            console.debug('保存配置', state.config)
        }
    }, actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    }, getters: {},
}