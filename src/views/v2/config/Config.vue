<template>
  <el-container direction="vertical" style="padding: 0 20px">
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
        <el-tab-pane label="界面">
          <Ui />
        </el-tab-pane>
        <el-tab-pane label="行为">
          <Behavior />
        </el-tab-pane>
        <el-tab-pane label="屏蔽">
          <Blocks />
        </el-tab-pane>
        <el-tab-pane label="Aria2">
          <Aria2 />
        </el-tab-pane>
        <!--        <el-tab-pane label="Aria2">Task</el-tab-pane>-->
      </el-tabs>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import accounts from "@/views/v2/config/Accounts";
import {Title} from "gin-utils/dist/utils/DomUtils";
import Ui from "@/views/v2/config/Ui";
import Behavior from "@/views/v2/config/Behavior";
import Blocks from "@/views/v2/config/Blocks";
import Aria2 from "@/views/v2/config/Aria2";

export default {
  name: "Config",
  components: {Aria2, Blocks, Behavior, Ui, accounts},
  data() {
    return {}
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