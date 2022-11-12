<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">{{ $route.name }}</el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {routeName} from "@/router/route-name";

const name = routeName.user.bookmark.illust

export default {
  name: "IllustManga",
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