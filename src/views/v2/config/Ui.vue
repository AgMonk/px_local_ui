<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="搜索时,显示热门作品" label-align="right">
          <el-switch v-model="data.showPopular"
                     active-text="是"
                     class="config-switch"
                     inactive-text="否"
                     inline-prompt
                     @change="saveConfig"
          />
        </el-descriptions-item>
        <el-descriptions-item label="搜索时,显示相关标签" label-align="right">
          <el-switch v-model="data.showRelatedTags"
                     active-text="是"
                     class="config-switch"
                     inactive-text="否"
                     inline-prompt
                     @change="saveConfig"
          />
        </el-descriptions-item>
        <el-descriptions-item label="将已收藏作品分组显示" label-align="right">
          <el-switch v-model="data.groupBookmarked"
                     active-text="是"
                     class="config-switch"
                     inactive-text="否"
                     inline-prompt
                     @change="saveConfig"
          />
        </el-descriptions-item>
        <el-descriptions-item label="作品卡片的大小" label-align="right">
          <el-slider v-model="data.cardSize" :max="250" :min="100" :step="10" show-input show-stops @change="saveConfig" />
        </el-descriptions-item>

      </el-descriptions>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import IllustCard from "@/components/v2/illust/card/illust-card";

export default {
  name: "Ui",
  components: {IllustCard},
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
      this.data = config.ui

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
.config-switch {
  --el-switch-on-color: #13ce66;
  --el-switch-off-color: #ff4949;
}
</style>