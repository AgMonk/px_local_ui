<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>最新小说</el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";

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
  computed: {},
  methods: {
    load(route, force) {

    }
  },
  mounted() {
    Title.set("最新小说")
    this.load(this.$route)
  },
  watch: {
    $route(to) {

    }
  },
  props: {},
}

</script>

<style scoped>

</style>