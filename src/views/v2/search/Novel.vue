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
      const {params, query} = route
      console.log(params, query)
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '搜索小说') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>