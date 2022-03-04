<template>
  <div id="app">
    <div id="nav">
      <my-navigation />
      <div style="text-align: left;margin:2px 0">
        <el-button size="small" type="primary" @click="back">&lt;</el-button>
        <el-button size="small" type="primary" @click="forward">></el-button>
        <el-button v-if="$route.query.from" size="small" type="primary" @click="$router.push($route.query.from)">↑</el-button>
      </div>
    </div>
    <router-view />
    <current-user-avatar />
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
import MyNavigation from "@/components/common/my-navigation";
import {mapActions, mapMutations} from "vuex";
import CurrentUserAvatar from "@/components/user/CurrentUserAvatar";

export default {
  components: {CurrentUserAvatar, MyNavigation},
  methods: {
    ...mapActions("Aria2", [`checkCompleted`]),
    ...mapMutations("Config", [`loadConfig`]),
    back() {
      history.back();
    },
    forward() {
      history.forward()
    }
  },
  mounted() {
    setInterval(() => this.checkCompleted(), 30 * 1000)
    this.loadConfig()
  },
}
</script>