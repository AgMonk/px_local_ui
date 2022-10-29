<template>
  <el-menu
      :default-active.sync="activeIndex"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-demo"
      mode="horizontal"
      router
      text-color="#fff"
      @select="select"
  >
    <my-navigation-item v-for="(route,i) in routes" :key="i" :route="route" parent-path="" />
  </el-menu>
</template>

<script>
import MyNavigationItem from "@/components/v1/common/my-navigation-item";

export default {
  name: "my-navigation",
  components: {MyNavigationItem},
  data() {
    return {
      routes: [
        {path: '/home', name: '首页'},
        {path: "/artworks", name: "作品"},
        {path: "/search", name: "搜索"},
        {path: "/discover", name: "发现"},
        {path: "/follow-latest", name: "关注"},
        {path: "/fanbox/index", name: "Fanbox"},
        {path: "/config", name: "配置"},
      ],
      activeIndex: "",
      url: "",
    }
  },
  computed: {},
  methods: {
    handleClick(e) {
      console.log(e)
    },
    select(index, indexPath) {
      // console.log(this.activeIndex)
    }
  },
  mounted() {
    this.activeIndex = this.$route.path
  },
  watch: {
    $route(to, from) {
      this.activeIndex = to.path
    }
  }
}

</script>

<style scoped>

</style>