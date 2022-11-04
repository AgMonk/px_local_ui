import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: "/follow/latest/illust/1"
    },
    {
        path: "/follow/latest",
        redirect: "/follow/latest/illust/1"
    },
    {
        path: '/follow/latest',
        name: '最新作品',
        component: () => import("../views/v2/follow_latest/Home"),
        children: [
            {path: "illust/:page", name: "最新绘画", component: () => import("../views/v2/follow_latest/Illust"),},
            {path: "novel/:page", name: "最新小说", component: () => import("../views/v2/follow_latest/Novel"),},
        ]
    },
    {
        path: '/search',
        name: '搜索',
        component: () => import("../views/v2/search/Home"),
        children: [
            {path: "illust/:keyword", name: "搜索绘画", component: () => import("../views/v2/search/Illust"),},
            {path: "novel/:keyword", name: "搜索小说", component: () => import("../views/v2/search/Novel"),},
        ]
    },
    {
        path: '/discovery',
        name: '发现',
        component: () => import("../views/v2/discovery/Home"),
        children: [
            {path: "illust", name: "发现绘画", component: () => import("../views/v2/discovery/Illust"),},
            {path: "novel", name: "发现小说", component: () => import("../views/v2/discovery/Novel"),},
        ]
    },
    {
        path: '/user/:uid',
        name: '用户主页',
        component: () => import("../views/v2/user/Home"),
        children: [
            {path: "illust", name: "用户插画", component: () => import("../views/v2/user/IllustManga"),},
            {path: "manga", name: "用户漫画", component: () => import("../views/v2/user/IllustManga"),},
            {path: "novel", name: "用户小说", component: () => import("../views/v2/user/Novel"),},
            {path: "bookmark", name: "用户收藏", component: () => import("../views/v2/user/Bookmark"),},
            {path: "request", name: "用户约稿", component: () => import("../views/v2/user/Request"),},

        ]
    },

    {
        path: "/illust/:pid",
        name: "绘画详情",
        component: () => import("../views/v2/detail/Illust")
    },
    {
        path: "/config",
        name: "配置",
        component: () => import("../views/v2/config/Config")
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
