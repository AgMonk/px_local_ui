<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {getUserProfileAll} from "@/assets/js/request/user";

export default {
  name: "User",
  data() {
    return {}
  },
  computed: {},
  methods: {
    load(route) {
      if (route.path.startsWith('/user')) {
        const uid = Number(route.params.uid)
        getUserProfileAll(uid)
      }
    },
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>