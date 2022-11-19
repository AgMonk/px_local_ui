import {createRouter, createWebHistory} from 'vue-router'
import {routeName} from "@/router/route-name";

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
        name: routeName.followLatest.index,
        component: () => import("../views/v2/follow_latest/Home"),
        children: [
            {path: "illust/:page", name: routeName.followLatest.illust, component: () => import("../views/v2/follow_latest/Illust"),},
            {path: "novel/:page", name: routeName.followLatest.novel, component: () => import("../views/v2/follow_latest/Novel"),},
        ]
    },
    {
        path: '/search',
        name: routeName.search.index,
        component: () => import("../views/v2/search/Home"),
        children: [
            {path: "illust/:keyword", name: routeName.search.illust, component: () => import("../views/v2/search/Illust"),},
            {path: "novel/:keyword", name: routeName.search.novel, component: () => import("../views/v2/search/Novel"),},
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
        name: routeName.user.index,
        component: () => import("../views/v2/user/Home"),
        children: [
            {path: "illust", name: routeName.user.illust, component: () => import("../views/v2/user/IllustManga"),},
            {path: "manga", name: routeName.user.manga, component: () => import("../views/v2/user/IllustManga"),},
            {path: "novel", name: routeName.user.novel, component: () => import("../views/v2/user/Novel"),},
            {path: "bookmark", name: routeName.user.bookmark, component: () => import("../views/v2/user/Bookmark"),},
            {path: ":type/:tag/:page", name: routeName.user.workWithTag, component: () => import("../views/v2/user/WorkWithTag"),},
            {path: "request", name: "用户约稿", component: () => import("../views/v2/user/Request"),},

        ]
    },
    {
        path: "/illust/:pid",
        name: "绘画详情",
        component: () => import("../views/v2/detail/Illust")
    },
    {
        path: "/novel/:nid",
        name: "小说详情",
        component: () => import("../views/v2/detail/Novel")
    },
    {
        path: "/novel/series/:seriesId",
        name: "小说系列",
        component: () => import("../views/v2/series/Novel")
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
