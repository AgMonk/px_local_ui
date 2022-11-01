<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <!--      todo 搜索框-->
      <!--      todo 搜索类型-->
      <!--      todo 搜索筛选条件 模式 日期-->
    </el-header>
    <el-main>
      <!--      todo 翻页-->
      <!--      todo 已保存的搜索 -->
      <router-view />
      <!--      todo 翻页-->
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
export default {
  name: "Home",
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