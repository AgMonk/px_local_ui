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
      <el-button size="small" type="primary" @click="load($route,true)">刷新</el-button>
    </el-header>
    <el-main style="text-align: left">
      <el-scrollbar height="651px">
        <illust-card v-for="pid in pidShow" :pid="pid" @image-load="move" />
      </el-scrollbar>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {mapActions, mapState} from "vuex";
import IllustCard from "@/components/illust/IllustCard";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "FollowLatest",
  components: {IllustCard},
  data() {
    return {
      loading: false,
      pidShow: [],
      pidList: [],
      page: 1,
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),

  },
  methods: {
    ...mapActions("FollowLatest", [`getFollowLatest`]),
    move() {
      // console.log(e)
      if (this.pidList.length > 0) {
        this.pidShow.push(...this.pidList.splice(0, 1))
      } else {
        console.log(this.pidList)
      }
    },
    load(route, force) {
      if (route.name !== '关注作品') {
        return;
      }
      this.loading = true;

      const page = Number(route.params.page)
      this.page = page;
      this.getFollowLatest({page, force}).then(res => {
        this.pidShow = [];
        this.pidList = res;
        this.loading = false;
        setTimeout(() => this.move(), 300)
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