<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" @refresh="load($route, true)" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
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
    }
  },
  emits: ['load-profile-all'],
  computed: {},
  methods: {
    ...mapActions("User", [`getUserProfileAll`]),
    ...mapActions("Artworks", [`getUserProfileIllust`]),
    loadProfileAll(uid, force) {
      this.getUserProfileAll({uid, force}).then(res => {
        this.data = res.illusts

        const illust = res.illusts.length
        const manga = res.manga.length
        this.$emit('load-profile-all', {illust, manga, type: 'illust'})

        this.loadProfileIllust(uid, this.page)
      }).catch(reason => autoRetry(reason, () => this.loadProfileAll(uid)))
    },
    loadProfileIllust(uid, page = 1, size = 48) {
      const start = (page - 1) * size;
      const end = Math.min(this.data.length, start + size);
      const data = this.data.slice(start, end)
      this.getUserProfileIllust({uid, page, data, type: 'illust', is_first_page: page === 1 ? 1 : 0}).then(() => {
        console.log(data)
        this.$refs['card-div'].clear(data)
      }).catch(reason => autoRetry(reason, () => this.loadProfileIllust(uid, page, size)))
    },
    load(route, force) {
      if (route.name === '用户插画') {
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