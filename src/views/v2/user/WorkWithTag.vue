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

const name = routeName.user.workWithTag

export default {
  name: "WorkWithTag",
  data() {
    return {}
  },
  components: {},
  computed: {},
  methods: {
    load(route, force) {
      const {uid, type, page, tag} = route.params

      console.log(route.params)
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