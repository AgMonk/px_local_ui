import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Config from "@/views/Config";
import Artworks from "@/views/Artworks";
import ArtworkDetail from "@/views/ArtworkDetail";
import FollowLatest from "@/views/FollowLatest";

const routes = [
    {
        path: '/',
        redirect: "/home",
    },
    {
        path: '/home',
        name: '首页',
        component: Home
    },
    {
        path: '/follow-latest',
        redirect: "/follow-latest/1",
    },
    {
        path: '/follow-latest/:page',
        name: '关注作品',
        component: FollowLatest
    },
    {
        path: '/config',
        name: '配置',
        component: Config,
    },
    {
        path: '/artworks',
        name: '作品详情组',
        component: Artworks,
        children: [
            {
                path: ":pid",
                name:"作品详情",
                component:ArtworkDetail,
            }
        ],
    },


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
