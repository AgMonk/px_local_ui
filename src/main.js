import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import Clipboard from 'v-clipboard3';

import 'gin-utils/css/global.css'
import RetryDiv from "@/components/v2/retry-div";

createApp(App)
    .use(Clipboard)
    .component("retry-div", RetryDiv)
    .use(ElementPlus, {locale: zhCn,})
    .use(store).use(router).mount('#app')
