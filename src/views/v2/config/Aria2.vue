<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="下载根目录" label-align="right">
          <el-input v-model="data.homePath" @change="saveConfig" />
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "Aria2",

  data() {
    return {
      data: {},
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapMutations("Config", ['saveConfig']),
    load(config) {
      this.data = config.aria2
    }
  },
  mounted() {
    this.load(this.config)
  },
  watch: {
    config(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>