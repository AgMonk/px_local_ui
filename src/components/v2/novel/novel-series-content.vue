<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h2 style="color:white;text-align: left">正文列表</h2>
    </el-header>
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">

      </retry-div>
    </el-main>
  </el-container>

</template>

<script>
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";

const name = "小说系列正文列表"

export default {
  name: "novel-series-content",
  data() {
    return {
      params: {
        seriesId: this.seriesId,
        force: false,
        page: 1,
        size: 10
      },
      data: undefined,
    }
  },
  components: {},
  computed: {},
  methods: {
    ...mapActions("Novel", ['seriesContent']),
    success(e) {
      console.log(e)
      this.data = e;
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    request({seriesId, force, page, size}) {
      return this.seriesContent({seriesId, force, page, size})
    },
    load(seriesId, page) {
      this.params = {
        seriesId: seriesId,
        force: false,
        page: page || 1,
        size: 10
      }
    }
  },
  mounted() {
  },
  watch: {
    seriesId(to) {
      this.load(to)
    }
  },
  props: {
    seriesId: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>