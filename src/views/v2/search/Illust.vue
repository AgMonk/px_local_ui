<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h2 style="color: white">{{ $route.name }}</h2>
    </el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "Illust",
  data() {
    return {}
  },
  computed: {},
  methods: {
    load(route, force) {
      const {params, query} = route
      console.log(params, query)
    }
  },
  mounted() {
    this.load(this.$route)
    this.$emit("change-total", 5000);
  },
  watch: {
    $route(to) {
      if (to.name === '搜索绘画') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>