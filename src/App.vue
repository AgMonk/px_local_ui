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
        {path: "/search/illust", name: "搜索"},
        {path: "/config", name: "配置"},
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
    } else {
      ElMessage.error("请先登陆");
    }
  },
}
</script>