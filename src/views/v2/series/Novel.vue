<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header style="color:white">{{ $route.name }}</el-header>-->
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
      </retry-div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";

const name = "小说系列"

export default {
  name: "Novel",
  data() {
    return {
      showDialog: {},
      loading: {},
      params: {
        filter: {},
        page: 1,
        size: 10,
      },
      form: {},
      data: [],
      total: 10,
    }
  },
  components: {},
  computed: {},
  methods: {
    load(route, force) {

    }
  },
  mounted() {
    Title.set(name)
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>