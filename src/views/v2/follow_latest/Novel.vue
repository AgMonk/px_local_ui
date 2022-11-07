<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <el-main style="text-align: left">
      <retry-div :params="params" :request="request" @failed="failed" @success="success">
        <novel-card-group ref="cardGroup" />
      </retry-div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import RetryDiv from "@/components/v2/retry-div";
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";
import NovelCard from "@/components/v2/novel/card/novel-card";
import NovelCardGroup from "@/components/v2/novel/card/novel-card-group";

export default {
  name: "Novel",
  components: {NovelCardGroup, NovelCard, RetryDiv},
  data() {
    return {
      params: {
        page: Number(this.$route.params.page),
        force: false,
      },
      data: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions('Novel', ['followLatest']),
    //请求
    request(params) {
      return this.followLatest(params)
    },
    //成功回调
    success(res) {
      this.$nextTick(() => {
        this.$refs.cardGroup.clear(res)
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    load(route, force) {
      this.params = {page: Number(route.params.page), force}
    }
  },
  mounted() {
    Title.set("最新小说")
  },
  watch: {
    $route(to) {
      if (to.name === "最新小说") {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>