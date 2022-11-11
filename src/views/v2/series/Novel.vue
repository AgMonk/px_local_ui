<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header style="color:white">{{ $route.name }}</el-header>-->
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
      </retry-div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";

const name = "小说系列"

export default {
  name: "Novel",
  data() {
    return {
      params: {
        seriesId: Number(this.$route.params.seriesId),
        force: false,
      },
    }
  },
  components: {},
  computed: {},
  methods: {
    ...mapActions("Novel", ['series', 'seriesContent']),
    success(e) {
      console.log(e)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    request({seriesId, force}) {
      return this.series({seriesId, force})
    },
    load(route, force) {
      this.params = {
        seriesId: Number(route.params.seriesId),
        force,
      }
    }
  },
  mounted() {
    Title.set(name)
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>