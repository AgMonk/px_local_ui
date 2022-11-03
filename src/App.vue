<template>
  <div id="app">
    <div id="nav">
      <my-navi :routes="routes" />
    </div>
    <router-view />
    <el-backtop />
    <el-link href="https://github.com/AgMonk/px_local_ui" target="bland" type="primary">Github</el-link>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  /*padding: 30px;*/
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}


</style>
<script>
import MyNavi from "@/components/v2/navi/my-navi";
import {mapGetters} from "vuex";
import {Api} from "pixiv-web-api-for-browser/dist";
import {instance} from "@/assets/v2/axios";
import {ElMessage} from "element-plus";
import {Title} from "gin-utils/dist/utils/DomUtils";

export default {
  components: {MyNavi,},
  data() {
    return {
      routes: [
        {path: "/follow/latest", name: "最新"},
        {path: "/search", name: "搜索"},
        {path: "/discovery", name: "发现"},
        {path: "/config", name: "配置"},
        //肯定 以及确信
        {path: "/illust/99147997", name: "老婆"},
      ]
    }
  },
  methods: {
    ...mapGetters("Account", ['getCurrent']),
    back() {
      history.back();
    },
    forward() {
      history.forward()
    }
  },
  mounted() {
    this.$store.commit("Account/loadAccount")
    this.$store.commit("Config/loadConfig")
    Title.suffix = 'PLU'
    Title.set("启动中..")

    let account = this.getCurrent();
    if (account) {
      let api = new Api(instance, account.token)
      this.$store.commit("setApi", api)
      console.log("用户已登陆", account.uid, account.name)

      this.routes.push({path: '/user/' + account.uid, name: "我的"})
    } else {
      ElMessage.error("请先登陆");
    }

    this.$store.dispatch("Aria2/getVersion").then(res => {
      const {version} = res
      console.log(`Aria2已连接 版本号：`, version)
    })
    this.$store.dispatch("Aria2/init")
  },
}
</script>