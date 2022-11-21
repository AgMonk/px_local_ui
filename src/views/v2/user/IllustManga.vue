<template>
  <retry-div :params="params" :ready="ready" :request="request" @failed="failed" @success="success">
    <el-pagination v-model:current-page="page"
                   :layout="layout"
                   :page-size="size"
                   :total="total"
                   hide-on-single-page
                   size="small"
                   @current-change="changePage"
    />
    <illust-card-group ref="cardGroup" @request-refresh="refresh" />
    <el-pagination v-model:current-page="page"
                   :layout="layout"
                   :page-size="size"
                   :total="total"
                   hide-on-single-page
                   size="small"
                   @current-change="changePage"
    />
  </retry-div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import RetryDiv from "@/components/v2/retry-div";
import {ElMessage} from "element-plus";
import {routeName} from "@/router/route-name";

export default {
  name: "IllustManga",
  components: {RetryDiv, IllustCardGroup},
  data() {
    return {
      layout: "prev, pager, next, jumper",
      ready: false,
      page: 1,
      size: 60,
      total: 10,
      params: {},
    }
  },
  computed: {},
  methods: {
    ...mapActions("User", ['profileIllusts']),
    ...mapGetters("User", ['getProfile']),
    changePage(page) {
      console.log(page)
      this.$router.push({query: {p: page}})
    },
    //刷新请求
    refresh() {
      this.load(this.$route, true)
    },
    //请求
    request(params) {
      return this.profileIllusts(params)
    },
    //成功回调
    success(res) {
      this.$nextTick(() => {
        this.$refs.cardGroup && this.$refs.cardGroup.clear(res.map(id => {
          return {id}
        }))
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //加载方法
    load(route, force) {
      let type = route.path.split('/')[3]
      type = type === 'manga' ? type : 'illusts'

      this.uid = Number(route.params.uid);
      this.page = Number(route.query.p || 1);
      this.illusts = this.getProfile()(this.uid)[type]
      this.total = this.illusts.length
      const start = (this.page - 1) * this.size
      const end = Math.min(this.page * this.size, this.illusts.length)
      const ids = this.illusts.slice(start, end)

      this.params = {uid: this.uid, ids, force}
      //参数已准备好
      this.ready = true;
    },
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if ([routeName.user.illust, routeName.user.manga].includes(to.name)) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>