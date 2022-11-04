<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header style="color:white">{{ $route.name }}</el-header>-->
    <el-main v-loading="loading">
      <div v-if="failed" style="color: white;cursor: pointer;height: 300px" @click="refresh">
        <h3>加载失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-else style="min-height: 500px">
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
      </div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {mapActions, mapGetters} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";

export default {
  name: "Illust",
  components: {IllustCardGroup},
  data() {
    return {
      loading: true,
      layout: "prev, pager, next, jumper",
      failed: false,
      illusts: {},
      showDialog: {},
      page: 1,
      size: 60,
      total: 10,
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
    refresh() {
      this.load(this.$route, true)
    },
    load(route, force) {
      Title.set(route.name)
      const uid = Number(route.params.uid);
      const page = Number(route.query.p || 1);

      this.page = page;
      this.illusts = this.getProfile()(uid).illusts
      this.total = this.illusts.length

      //截取数组的起始位置
      const start = (page - 1) * this.size
      const end = Math.min(page * this.size, this.illusts.length)
      const ids = this.illusts.slice(start, end)
      this.loading = true;
      this.profileIllusts({uid, ids, force}).then(res => {
        this.failed = false;
        this.$nextTick(() => {
          this.$refs.cardGroup && this.$refs.cardGroup.clear(res.map(id => {
            return {id}
          }))
        })
      }).catch(e => {
        console.error(e)
        this.failed = true;
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '用户插画') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>