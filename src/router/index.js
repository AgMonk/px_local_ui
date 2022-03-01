import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Config from "@/views/Config";

const routes = [
  {
    path:'/',
    redirect:"/home",
  },
  {
    path: '/home',
    name: '首页',
    component: Home
  },
    {
    path: '/config',
    name: '配置',
    component: Config
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
