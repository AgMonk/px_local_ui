<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header></el-header>-->
    <el-main style="min-height: 300px">
      <div v-if="failed" style="color:white;cursor: pointer" @click="refresh">
        <h3>请求失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-if="!failed">
        <illust-card-group ref="cardGroup" @request-refresh="refresh" />
      </div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {Title} from "gin-utils/dist/utils/DomUtils";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {ElMessage} from "element-plus";

export default {
  name: "Illust",
  components: {IllustCardGroup,},
  data() {
    return {
      loading: false,
      failed: false,
      page: 1,
      total: 655350,
      data: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['followLatest']),

    refresh() {
      this.load(this.$route, true)
    },
    load(route, force) {
      const {page} = route.params
      this.loading = true;
      this.followLatest({page, force}).then(res => {
        this.failed = false;
        this.$nextTick(() => {
          this.$refs.cardGroup.clear(res.data)
        })
      }).catch(e => {
        console.error(e)
        ElMessage.error(e.message)
        this.failed = true;
      }).finally(() => {
        this.loading = false
      })

    }
  },
  mounted() {
    Title.set("最新绘画")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === "最新绘画") {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>