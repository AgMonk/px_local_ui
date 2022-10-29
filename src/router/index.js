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
        path: '/user/:uid',
        name: '用户主页',
        component: () => import("../views/v2/user/Home"),
        children: []
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
