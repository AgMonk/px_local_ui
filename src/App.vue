<template>
  <div id="app">
    <div id="nav">
      <my-navigation />
    </div>
    <router-view />
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

#app{
  background-color: #2c3e50;
}

</style>
<script>
import MyNavigation from "@/components/common/my-navigation";
import {mapActions, mapMutations} from "vuex";

export default {
  components: {MyNavigation},
  methods: {
    ...mapActions("Aria2", [`checkCompleted`]),
    ...mapMutations("Config", [`loadConfig`])
  },
  mounted() {
    setInterval(() => this.checkCompleted(), 30 * 1000)
    this.loadConfig()
  }
}
</script>