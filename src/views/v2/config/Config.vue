<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <el-button type="success" @click="jsonToConfig">导入</el-button>
      <copy-el-button :text="JSON.stringify(this.config)" type="primary">导出</copy-el-button>
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
import {mapMutations, mapState} from "vuex";
import {ElMessageBox} from "element-plus";
import CopyElButton from "@/components/v2/copy/copy-el-button";

export default {
  name: "Config",
  components: {CopyElButton, Aria2, Blocks, Behavior, Ui, accounts},
  data() {
    return {}
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapMutations("Config", ['updateConfig']),
    jsonToConfig() {
      ElMessageBox.prompt("请粘贴配置字符串", {
        title: "导入",
      }).then(({value}) => {
        this.updateConfig(JSON.parse(value))
      }).catch(e => {
        console.error(e)
      })
    },
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