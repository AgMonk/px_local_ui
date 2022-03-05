<template>
  <el-container v-loading="loading" :element-loading-spinner="svg"
                direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <el-header>
      <el-pagination v-model:current-page="page"
                     :total="655350"
                     layout="prev, pager, next,jumper"
                     @current-change="$router.push({params:{page:$event}})"

      />
    </el-header>
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" @refresh="load($route, true)" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {mapActions, mapGetters, mapState} from "vuex";
import IllustCard from "@/components/illust/IllustCard";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/illust/IllustCardDiv";

export default {
  name: "FollowLatest",
  components: {IllustCardDiv, IllustCard},
  data() {
    return {
      loading: false,
      step: {
        current: 0,
        max: 2,
      },
      pidShow: [],
      pidList: [],
      page: 1,
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    ...mapActions("FollowLatest", [`getFollowLatest`]),
    load(route, force) {
      if (route.name !== '关注作品') {
        return;
      }
      this.loading = true;

      const page = Number(route.params.page)
      this.page = page;
      this.getFollowLatest({page, force}).then(res => {
        this.$refs['card-div'].clear(res.map(i => i.id))
        this.loading = false;
      }).catch(reason => autoRetry(reason, () => this.load(route, force)))
    }
  },
  mounted() {
    setTitle("关注作品")
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