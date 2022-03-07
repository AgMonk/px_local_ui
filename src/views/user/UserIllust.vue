<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-main>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "UserIllust",
  data() {
    return {
      data: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("User", [`getUserProfileAll`]),
    loadProfileAll(uid) {
      this.getUserProfileAll({uid}).then(res => {
        this.data = res.illusts

        //  todo 请求完成 返回作品数量
      }).catch(reason => autoRetry(reason, () => this.loadProfileAll(uid)))
    },
    load(route) {
      if (route.name === '用户插画') {
        const uid = Number(route.params.uid)
        this.loadProfileAll(uid)
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