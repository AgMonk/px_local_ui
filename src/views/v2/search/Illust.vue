<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <div v-if="failed" style="color:white;cursor: pointer;" @click="refresh">
        <h3>请求失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-if="!failed" style="min-height: 300px">
        <illust-card-group ref="cardGroup" @request-refresh="refresh" />
      </div>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";

export default {
  name: "Illust",
  components: {IllustCardGroup},
  data() {
    return {
      failed: false,
      loading: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['search']),
    refresh() {
      this.load(this.$route, true)
    },
    load(route, force) {
      const query = route.query
      const keyword = route.params.keyword
      console.log(keyword, query)
      this.failed = false;
      this.loading = true;
      this.search({keyword, params: query, force}).then(res => {
        console.log(res)
        const {illustManga, popular, relatedTags} = res
        this.failed = false;
        this.$emit("change-total", illustManga.total);
        this.$nextTick(() => {
          this.$refs.cardGroup.clear(illustManga.data)
        })
        // todo 显示相关标签
        // todo 显示热门作品
      }).catch(e => {
        console.error(e)
        this.failed = true;
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '搜索绘画') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>