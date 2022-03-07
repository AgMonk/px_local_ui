<template>
  <el-container v-loading="loading" :element-loading-spinner="svg"
                direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" disable-user-avatar @refresh="load($route, true)" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/illust/IllustCardDiv";

export default {
  name: "UserIllust",
  components: {IllustCardDiv},
  data() {
    return {
      data: [],
      page: 1,
      loading: false,
      type: 'illust',
    }
  },
  emits: ['load-profile-all'],
  computed: {
    ...mapState("Loading", [`svg`]),

  },
  methods: {
    ...mapActions("User", [`getUserProfileAll`]),
    ...mapActions("Artworks", [`getUserProfileIllust`]),
    loadProfileAll(uid, force) {
      this.getUserProfileAll({uid, force}).then(res => {
        this.data = res[this.type]

        const illust = res.illust.length
        const manga = res.manga.length
        this.$emit('load-profile-all', {illust, manga, type: this.type})

        this.loadProfileIllust(uid, this.page)
      }).catch(reason => autoRetry(reason, () => this.loadProfileAll(uid)))
    },
    loadProfileIllust(uid, page = 1, size = 48) {
      this.loading = true;
      const start = (page - 1) * size;
      const end = Math.min(this.data.length, start + size);
      const data = this.data.slice(start, end)
      this.getUserProfileIllust({uid, page, data, type: this.type, is_first_page: page === 1 ? 1 : 0}).then(() => {
        this.loading = false;
        this.$refs['card-div'].clear(data)
      }).catch(reason => autoRetry(reason, () => this.loadProfileIllust(uid, page, size)))
    },
    load(route, force) {
      if (route.name === '用户插画' || route.name === '用户漫画') {
        this.type = route.name === '用户插画' ? 'illust' : "manga";
        const uid = Number(route.params.uid)
        this.page = Number(route.params.page)
        this.loadProfileAll(uid, force)
      }
    },
  },
  mounted() {
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