<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main>
      <el-descriptions :column="2" border>
        <el-descriptions-item v-for="(label,key) in rules" :label="label" label-align="right">
          <el-select v-model="selection[key]" :filterable="true" :multiple="true" placeholder="选择以移除">
            <el-option v-for="op in data[key]" :label="op.toString()" :value="op" />
          </el-select>
          <el-button type="danger" @click="removeRules(key)">移除</el-button>
        </el-descriptions-item>
      </el-descriptions>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>
<script>
import {mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Blocks",
  data() {
    return {
      rules: {
        userIdRules: 'UID屏蔽',
        titleKeywordsRules: '标题关键字',
        tagRules: '标签',
        usernameKeywordsRules: '用户名关键字',
      },
      selection: {},
      data: {},

    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapMutations("Config", ['saveConfig']),
    removeRules(key) {
      let array = this.selection[key]
      ElMessageBox.confirm(`确认移除 ${this.rules[key]} 项目中的 ${array.length} 个规则?`, "移除规则").then(() => {
        ElMessage.success("已移除")
        this.data[key] = this.data[key].filter(i => !array.includes(i))
        console.log(this.data[key])
        this.selection[key] = []
        this.saveConfig()
      }).catch(e => {
        console.error(e)
        ElMessage.info("已取消")
      })
    },
    load(config) {
      this.data = config.blocks

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