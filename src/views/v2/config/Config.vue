<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <!--      todo  -->
      <el-button type="success">导入</el-button>
      <el-button type="primary">导出</el-button>
    </el-header>
    <el-main>
      <el-tabs type="border-card">
        <el-tab-pane label="账号">
          <accounts />
        </el-tab-pane>
        <el-tab-pane label="常规">
          <!--          todo-->
        </el-tab-pane>
        <el-tab-pane label="屏蔽">
          <!--          todo-->
        </el-tab-pane>
        <el-tab-pane label="Task">Task</el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import accounts from "@/views/v2/config/Accounts";
import {Title} from "gin-utils/dist/utils/DomUtils";

export default {
  name: "Config",
  components: {accounts},
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
    Title.set("配置")
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