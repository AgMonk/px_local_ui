<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <retry-div :params="params" :request="request" @failed="failed" @success="success">
        <illust-card-group ref="cardGroup" @request-refresh="refresh" />
      </retry-div>
    </el-main>
  </el-container>
</template>

<script>
import {mapActions} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {Title} from "gin-utils/dist/utils/DomUtils";
import RetryDiv from "@/components/v2/retry-div";
import {ElMessage} from "element-plus";

export default {
  name: "Illust",
  components: {RetryDiv, IllustCardGroup},
  data() {
    return {
      params: {
        force: false,
        keyword: this.$route.params.keyword,
        params: this.$route.query
      },
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['search']),
    //刷新请求
    refresh() {
      this.$refs.cardGroup.clear([])
      this.load(this.$route, true)
    },
    request(params) {
      return this.search(params)
    },
    //成功回调
    success(res) {
      const {data, total, popular, relatedTags} = res
      this.$emit("change-total", total);
      this.$nextTick(() => {
        this.$refs.cardGroup.clear(data, [...popular.recent, ...popular.permanent])
      })
      // todo 显示相关标签
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    load(route, force) {
      this.params = {
        force,
        keyword: route.params.keyword,
        params: route.query,
      }
    }
  },
  mounted() {
    Title.set('搜索绘画')
  },
  watch: {
    $route(to) {
      if (to.name === '搜索绘画') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>