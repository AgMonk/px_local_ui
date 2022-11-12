<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">
      <el-radio-group v-model="params.type" size="small" type="primary" @change="pushRoute(params)">
        <el-radio-button label="illust">绘画</el-radio-button>
        <el-radio-button label="novel">小说</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-main>
      
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {routeName} from "@/router/route-name";
import {mapActions} from "vuex";

//用户收藏
const name = routeName.user.bookmark

export default {
  name: "Bookmark",
  data() {
    return {
      params: {
        //作品类型 'illust' 或 'novel'
        type: this.$route.query.type || 'illust',
        page: this.$route.query.page || 1,
        size: this.$route.query.size || 10,
        tag: this.$route.query.tag || '',
        rest: this.$route.query.rest || 'show',
        force: false,
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions("Bookmarks", ["illust", "illustTag"]),
    //跳转路由
    pushRoute({type, page, size, tag, rest,}) {
      this.$router.push({query: {type, page, size, tag, rest,}})
    },
    //路由切换时修改参数
    load(route, force) {
      Title.set(route.name)
      const query = route.query;
      const type = query.type || 'illust';
      const page = Number(query.page || 1);
      const size = Number(query.size || 10);
      const tag = query.tag || ''
      const rest = query.rest || 'show'

      this.params = {type, page, size, tag, rest, force}
    }
  },
  mounted() {
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