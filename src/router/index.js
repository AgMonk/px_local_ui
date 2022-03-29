import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Config from "@/views/Config";
import Artworks from "@/views/Artworks";
import ArtworkDetail from "@/views/ArtworkDetail";
import FollowLatest from "@/views/FollowLatest";
import Search from "@/views/Search";
import User from "@/views/User";
import UserIllust from "@/views/user/UserIllust";
import UserBookmark from "@/views/user/UserBookmark";
import Discover from "@/views/Discover";
import Fanbox from "@/views/Fanbox";
import FanboxItem from "@/views/fanbox/FanboxItem";
import FanboxIndex from "@/views/fanbox/FanboxIndex";
import FanboxCreator from "@/views/fanbox/FanboxCreator";

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
        path: '/search',
        name: '搜索',
        component: Search,
    },
    {
        path: '/discover',
        name: '发现',
        component: Discover,
    },
    {
        path: '/search/:keyword/:page',
        name: '搜索结果',
        component: Search,
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
                name: "作品详情",
                component: ArtworkDetail,
            }
        ],
    },
    {
        path: '/user/:uid',
        name: "用户主页",
        component: User,
        children: [
            {path: 'illust/:page', name: '用户插画', component: UserIllust},
            {path: 'manga/:page', name: '用户漫画', component: UserIllust},
            {path: 'bookmark/:page', name: '用户收藏', component: UserBookmark},
        ],
    },
    {
        path: '/fanbox',
        name: 'fanbox',
        component: Fanbox,
        children: [
            {path: 'item/:id', name: 'fanbox作品详情', component: FanboxItem},
            {path: 'creator/:id', name: 'fanbox创作者作品', component: FanboxCreator},
            {path: 'index', name: 'fanbox主页', component: FanboxIndex},
        ]
    }


]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
