<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">
      <el-radio-group v-model="type" size="small" type="primary" @change="pushRoute">
        <el-radio-button label="illust">绘画</el-radio-button>
        <el-radio-button label="novel">小说</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-main>
      <!--用户收藏 todo-->
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {routeName} from "@/router/route-name";

//用户收藏
const name = routeName.user.bookmark.index

export default {
  name: "Bookmark",
  data() {
    return {
      type: undefined,

    }
  },
  computed: {},
  methods: {
    //跳转路由
    pushRoute(e) {
      const name = routeName.user.bookmark[e]
      const uid = this.$route.params.uid
      this.$router.push({name, params: {uid}})
    },
    load(route, force) {
      Title.set(route.name)
      this.type = route.path.split('/')[4] || 'illust';

    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name.startsWith(name)) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>