<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h3 style="color:white">{{ uid }}</h3>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      uid: undefined,
    }
  },
  computed: {},
  methods: {
    load(route, force) {
      const {uid} = route.params
      this.uid = uid;
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '用户主页') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>