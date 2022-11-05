<template>
  <el-container direction="vertical">
    <el-main>
      <retry-div :params="params" :request="request" @failed="failed" @success="success">
        <illust-card-group ref="cardGroup" @request-refresh="refresh" />
      </retry-div>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {Title} from "gin-utils/dist/utils/DomUtils";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {ElMessage} from "element-plus";
import RetryDiv from "@/components/v2/retry-div";

export default {
  name: "Illust",
  components: {RetryDiv, IllustCardGroup,},
  data() {
    return {
      total: 655350,
      data: [],
      params: {
        page: Number(this.$route.params.page),
        force: false,
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['followLatest']),
    //刷新请求
    refresh() {
      this.$refs.cardGroup.clear([])
      this.load(this.$route, true)
    },
    //请求
    request(params) {
      return this.followLatest(params)
    },
    //成功回调
    success(res) {
      this.$nextTick(() => {
        this.$refs.cardGroup.clear(res.data)
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //加载方法
    load(route, force) {
      this.params = {page: Number(route.params.page), force}
    }
  },
  mounted() {
    Title.set("最新绘画")
    // this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === "最新绘画") {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>