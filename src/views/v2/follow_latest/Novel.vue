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
      params: {
        page: Number(this.$route.params.page),
        force: false,
      }
    }
  },
  computed: {},
  methods: {
    load(route, force) {
      this.params = {page: Number(route.params.page), force}

      this.$store.dispatch("Novel/followLatest", this.params).then(res => {
        console.log(res)
      })
    }
  },
  mounted() {
    Title.set("最新小说")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === "最新小说") {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>