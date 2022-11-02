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
import {mapState} from "vuex";

export default {
  name: "Aria2",

  data() {
    return {}
  },
  computed: {
    ...mapState("Config", ['config']),
  }, methods: {
    load(route, force) {

    }
  },
  mounted() {
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