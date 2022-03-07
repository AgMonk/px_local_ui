<template>
  <el-container v-loading="loading" :element-loading-spinner="svg"
                direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <!--  <el-container direction="horizontal">-->
    <el-header v-if="config.uid===params.uid">
      <el-radio-group v-model="query.show" size="large" @change="pushRoute">
        <el-radio-button label="show">公开</el-radio-button>
        <el-radio-button label="hide">不公开</el-radio-button>
      </el-radio-group>
    </el-header>
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" :disable-group="config.uid===params.uid" @refresh="load($route, true)" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/illust/IllustCardDiv";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "UserBookmark",
  components: {IllustCardDiv},
  data() {
    return {
      params: {
        page: 1,
        uid: 0,
      },
      query: {
        show: 'show',
        tag: '',
      },
      loading: false,
    }
  },
  emits: ['load-profile-all'],
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("User", [`getUserBookmark`]),
    pushRoute() {
      this.$router.push({name: '用户收藏', params: this.params, query: this.query})
    },
    loadUserBookmark(force) {
      this.loading = true;
      this.getUserBookmark(Object.assign({}, this.params, this.query, {force})).then(res => {
        this.loading = false;
        this.$refs['card-div'].clear(res.illusts)
        this.$emit('load-profile-all', {bookmark: res.total, type: 'bookmark'})
      }).catch(reason => autoRetry(reason, () => this.loadUserBookmark(force)))
    },
    load(route, force) {
      if (route.name === '用户收藏') {
        this.params.uid = Number(route.params.uid)
        this.params.page = Number(route.params.page)
        this.query.tag = route.query.tag ? route.query.tag : '';
        this.query.show = route.query.show ? route.query.show : 'show';
        this.loadUserBookmark(force)
      }
    },
  },
  mounted() {
    setTitle("用户收藏")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      this.load(to)
    }
  },
  props: {},
}

</script>

<style scoped>

</style>