<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <el-radio-group v-model="type" size="small" type="primary" @change="typeChanged">
        <el-radio-button label="illust">绘画</el-radio-button>
        <el-radio-button label="novel">小说</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="mode" size="small" style="margin-left: 20px" @change="typeChanged">
        <el-radio-button v-for="item in modes" :label="item.label">{{ item.text }}</el-radio-button>
      </el-radio-group>
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
      modes: [
        {label: "all", text: '全部'},
        {label: "r18", text: 'R-18'},
        {label: "safe", text: '安全'},
      ],
      type: undefined,
      mode: undefined,

    }
  },
  computed: {},
  methods: {
    typeChanged() {
      let name = this.type === 'illust' ? "发现绘画" : "发现小说";
      this.$router.push({name, query: {mode: this.mode}})
    },
    load(route) {
      this.type = route.path.split('/')[2] || 'illust';
      this.mode = route.query.mode || "all"
      this.typeChanged(this.type)
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name.startsWith('发现')) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>