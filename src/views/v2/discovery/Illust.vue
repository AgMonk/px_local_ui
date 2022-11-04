<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color: white">{{ $route.name }}</el-header>
    <el-main>
      <retry-div :request="request" @failed="success" @success="success">
        <h4 style="color: white">标题</h4>
      </retry-div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import RetryDiv from "@/components/v2/retry-div";

export default {
  name: "Illust",
  components: {RetryDiv},
  data() {
    return {
      showDialog: {},
      loading: {},
      params: {
        filter: {},
        page: 1,
        size: 10,
      },
      form: {},
      data: [],
      total: 10,
    }
  },
  computed: {},
  methods: {
    request(force) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(1)
        }, 4000)
      })
    },
    success(res) {
      console.log(res)
    },
    load(route, force) {

    }
  },
  mounted() {
    Title.set('发现绘画')
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '发现绘画') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>