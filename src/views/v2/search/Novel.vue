<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <!--todo 搜索小说-->
      <retry-div :params="params" :ready="ready" :request="request" @failed="failed" @success="success">

      </retry-div>
    </el-main>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";
import {routeName} from "@/router/route-name";
import {mapActions} from "vuex";

export default {
  name: "Novel",
  data() {
    return {
      ready: false,
      params: {
        force: false,
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions("Novel", ['search']),
    request(params) {
      return this.search(params)
    },
    //成功回调
    success(res) {
      console.log(res)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    load(route, force) {
      const query = route.query;
      this.params = {
        force,
        keyword: route.params.keyword,
        params: {
          p: query.p || 1,
          mode: query.mode || "all",
          scd: query.scd,
          ecd: query.ecd,
          s_mode: query.s_mode || "s_tag",
          gs: query.gs || 0,
          tgt: query.tgt,
          tlt: query.tlt,
        },
      }
      console.log(this.params)
      this.ready = true;
    }
  },
  mounted() {
    Title.set(routeName.search.novel)
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === routeName.search.novel) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>