<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header ></el-header>-->
    <el-main>
      <div style="text-align: left">
        <el-radio-group v-model="type" size="small" type="primary" @change="change">
          <el-radio-button label="illust">绘画</el-radio-button>
          <el-radio-button label="novel">小说</el-radio-button>
        </el-radio-group>
      </div>
      <div>
        <el-pagination v-model:current-page="page"
                       :layout="layout"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
      </div>
      <router-view />
      <div>
        <el-pagination v-model:current-page="page"
                       :layout="layout"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {DomUtils} from "gin-utils/dist/utils/DomUtils";

export default {
  name: "FollowLatest",
  data() {
    return {
      page: 1,
      total: 655350,
      layout: "prev, pager, next, jumper",
      type: "",
    }
  },
  computed: {},
  methods: {
    changePage(page) {
      this.$router.push({params: {page}})
      DomUtils.scrollYToTop()
    },
    change(type) {
      this.$router.push(`/follow/latest/${type}/1`)
    },
    load(route, force) {
      const {page} = route.params
      const {href} = route
      this.page = Number(page);
      this.type = href.split("/")[3]
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (["最新绘画", "最新小说"].includes(to.name)) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>