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
    <novel-card-group ref="cardGroup" />
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
import NovelCardDiv from "@/components/v2/novel/card/novel-card-div";
import NovelCardGroup from "@/components/v2/novel/card/novel-card-group";
import {ElMessage} from "element-plus";

export default {
  name: "Novel",
  components: {NovelCardGroup, NovelCardDiv},
  data() {
    return {
      layout: "prev, pager, next, jumper",
      ready: false,
      page: 1,
      size: 60,
      total: 10,
      profiles: [],
      params: {},

    }
  },
  computed: {},
  methods: {
    ...mapActions("User", ['profileNovels']),
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
      return this.profileNovels(params)
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

      this.uid = Number(route.params.uid);
      this.page = Number(route.query.p || 1);
      this.profiles = this.getProfile()(this.uid).novels
      this.total = this.profiles.length
      const start = (this.page - 1) * this.size
      const end = Math.min(this.page * this.size, this.profiles.length)
      const ids = this.profiles.slice(start, end)

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
      if (to.name === '用户小说') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>