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
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
      </retry-div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {routeName} from "@/router/route-name";
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";

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
        size: this.$route.query.size || 48,
        tag: this.$route.query.tag || '',
        rest: this.$route.query.rest || 'show',
        force: false,
      },
      data: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Bookmarks", ["illust", "novel"]),
    //请求
    request({type, page, size, tag, rest, force}) {
      const method = type === 'illust' ? this.illust : this.novel;
      const uid = Number(this.$route.params.uid)
      return method({force, uid, param: {page, size, tag, rest}})
    },
    //成功回调
    success(res) {
      this.data = res
      console.log(res)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
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
      const size = Number(query.size || 48);
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