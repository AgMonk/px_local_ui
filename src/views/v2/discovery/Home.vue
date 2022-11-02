<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-header style="text-align: left">
      <el-radio-group v-model="type" size="small" type="primary" @change="typeChanged">
        <el-radio-button label="illust">绘画</el-radio-button>
        <el-radio-button label="novel">小说</el-radio-button>
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
      type: undefined,
    }
  },
  computed: {},
  methods: {
    typeChanged(e) {
      this.$router.push("/discovery/" + e)
    },
    load(route, force) {
      this.type = route.path.split('/')[2] || 'illust';
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