// 配置
// noinspection JSUnusedLocalSymbols

import {setCookies} from "@/assets/js/utils/CookieUtils";
import {getCache, putCache} from "@/assets/js/utils/StorageUtils";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
    namespaced: true,
    state: {
        config: {
            uid: 0,
            token: "",
            //保存的搜索关键字
            //图片服务器
            domain: "/pxre",
            //显示作品卡片时，缓存该作品详情（可以显示出收藏数）
            detail: false,
            //过滤器
            filter: {
                uid: [],
                //作品标题关键字屏蔽
                title: ['国漫', '资源'],
                //作者名称关键字屏蔽
                username: ['王者', '国漫', '资源'],
            },
            search: {
                keywords: [],
                popular: false,
                relatedTags: false,
                lazy: true,
                group: true,
            },
            aria2: {
                dir: 'D:/download/aria2/plu/'
            }
        },
    },
    mutations: {
        method(state, payload) {

        },
        importArray(state, {title, path, overwrite}) {
            ElMessageBox.prompt('请粘贴导出的字符串', `导入 ${title}`, {}).then(res => {
                const array = JSON.parse(res.value)
                if (overwrite) {
                    state.config[path[0]][path[1]] = array
                } else {
                    state.config[path[0]][path[1]].push(...array)
                }
                putCache("config", state.config)
                ElMessage.success(`已导入 ${array.length} 个数据`)
            }).catch(reason => {
                if (reason === 'cancel') {
                    ElMessage.info("已取消")
                } else {
                    console.log(reason)
                    ElMessage.error("字符串非法")
                }
            })
        },
        addKeyword(state, keyword) {
            ElMessageBox.prompt('TIPS:会覆盖名称相同的已有搜索', '保存名称', {
                inputValue: keyword,
            }).then(res => {
                const label = res.value
                //过滤label相同的快捷搜索
                state.config.search.keywords = state.config.search.keywords.filter(i => i.label !== label)
                state.config.search.keywords.push({label, keyword})
                //排序
                state.config.search.keywords.sort((a, b) => a.label.localeCompare(b.label))

                putCache("config", state.config)
                ElMessage.success("已保存搜索")
            }).catch(reason => {
                if (reason === 'cancel') {
                    ElMessage.info("已取消")
                } else {
                    console.log(reason)
                    ElMessage.error("无法识别")
                }
            })
        },
        delKeyword(state, label) {
            ElMessageBox.confirm(`确认移除? ${label}`).then(() => {
                state.config.search.keywords = state.config.search.keywords.filter(i => i.label !== label)
                putCache("config", state.config)
            }).catch(reason => {
                console.log(reason)
                ElMessage.info("已取消")
            })
        },
        addFilter(state, {key, value}) {
            state.config.filter[key].push(value)
            ElMessage.success("添加成功")
            putCache("config", state.config)
        },
        delFilter(state, {key, index}) {
            state.config.filter[key].splice(index, 1)
            ElMessage.success("移除成功")
            putCache("config", state.config)
        },
        loadConfig(state) {
            state.config = Object.assign({}, state.config, getCache("config"))
        },
        setAccounts(state, {cookies, token}) {
            setCookies(cookies, 30, "/pixiv-net")
            const pattern = /PHPSESSID=(\d+)/
            const group = pattern.exec(cookies)
            state.config.uid = Number(group[1]);
            state.config.token = token;
            putCache("config", state.config)
            window.location.reload()
        },
        setConfig(state, {key, value}) {
            state.config[key] = value;
            putCache("config", state.config)
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {
        isFilterExists: (state) => (key, value) => {
            const filter = state.config.filter;
            return filter.hasOwnProperty(key) && filter[key].includes(value)
        }
    },
}