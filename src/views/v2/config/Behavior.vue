<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="加载卡片时，缓存它的详情数据(todo)" label-align="right">
          <el-switch v-model="data.requestCardDetail"
                     active-text="是"
                     class="config-switch"
                     inactive-text="否"
                     inline-prompt
                     @change="saveConfig"
          />
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "Behavior",
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
      this.data = config.behavior

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