<template>
  <div id="app">
    <div id="nav">
      <!--      <my-navigation />-->
      <my-navi :routes="routes" />
      <!--      <div style="text-align: left;margin:2px 0">-->
      <!--        <el-button size="small" type="primary" @click="back">&lt;</el-button>-->
      <!--        <el-button size="small" type="primary" @click="forward">></el-button>-->
      <!--        <el-button v-if="$route.query.from" size="small" type="primary" @click="$router.push($route.query.from)">↑</el-button>-->
      <!--      </div>-->
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
import MyNavigation from "@/components/v1/common/my-navigation";
import CurrentUserAvatar from "@/components/v1/user/CurrentUserAvatar";
import MyNavi from "@/components/v2/navi/my-navi";
import {mapGetters} from "vuex";
import {Api} from "pixiv-web-api-for-browser/dist";
import {instance} from "@/assets/js/axios";
import {ElMessage} from "element-plus";
import {Title} from "gin-utils/dist/utils/DomUtils";

export default {
  components: {MyNavi, CurrentUserAvatar, MyNavigation},
  data() {
    return {
      routes: [
        {path: "/follow/latest", name: "最新"},
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