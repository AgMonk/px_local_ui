<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h2 style="color:white;text-align: left">正文列表</h2>
    </el-header>
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
        <el-pagination v-model:current-page="params.page"
                       :layout="layout"
                       :page-size="params.size"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="load(undefined,$event)"
        />
        <novel-series-content-card v-for="item in data " :data="item" />
        <el-pagination v-model:current-page="params.page"
                       :layout="layout"
                       :page-size="params.size"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="load(undefined,$event)"
        />
      </retry-div>
    </el-main>
  </el-container>

</template>

<script>
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";
import NovelSeriesContentCard from "@/components/v2/novel/series/novel-series-content-card";

const name = "小说系列正文列表"

export default {
  name: "novel-series-content",
  data() {
    return {
      layout: "prev, pager, next, jumper",
      params: {
        seriesId: this.seriesId,
        force: false,
        page: 1,
        size: 10
      },
      data: undefined,
    }
  },
  components: {NovelSeriesContentCard},
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
        seriesId: seriesId || this.seriesId,
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
    total: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>