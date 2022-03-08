<!--发现-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>
      <!--todo-->
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {discover} from "@/assets/js/request/discover";

export default {
  name: "Discover",
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
    discover({}).then(res => {
      console.log(res)
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>