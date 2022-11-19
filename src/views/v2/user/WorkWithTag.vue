<template>
  <retry-div :params="params" :ready="ready" :request="request" unmount-while-loading @failed="failed" @success="success">
    <el-pagination v-model:current-page="params.page"
                   :layout="layout"
                   :page-size="size"
                   :total="total"
                   hide-on-single-page
                   size="small"
                   @current-change="changePage"
    />
    <illust-card-group v-if="['illust','novel'].includes(type)" ref="cardGroup" />
    <novel-card-group v-else ref="cardGroup" />
    <el-pagination v-model:current-page="params.page"
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
import {routeName} from "@/router/route-name";
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import NovelCardGroup from "@/components/v2/novel/card/novel-card-group";

const name = routeName.user.workWithTag

export default {
  name: "WorkWithTag",
  data() {
    return {
      layout: "prev, pager, next, jumper",
      ready: false,
      size: 48,
      total: 100,
      params: {
        type: undefined,
        uid: undefined,
        page: undefined,
        tag: undefined,
      },
      type: undefined,
    }
  },
  components: {NovelCardGroup, IllustCardGroup},
  computed: {},
  methods: {
    ...mapActions("User", ['illustsWithTag', 'novelsWithTag', 'mangasWithTag']),
    changePage(page) {
      console.log(page)
      this.$router.push({params: {page}})
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    success({total, data, type}) {
      this.total = total
      this.type = type;

      this.$nextTick(() => {
        this.$refs.cardGroup.clear(data)
      })
    },
    request({uid, type, page, tag, force}) {
      const params = {
        tag,
        offset: Math.max((page - 1), 0) * this.size,
        limit: this.size,
      }
      const p = {uid, params, force}

      switch (type) {
        case 'illust':
          return this.illustsWithTag(p)
        case 'manga':
          return this.mangasWithTag(p)
        case 'novel':
          return this.novelsWithTag(p)
      }
    },
    load(route, force) {
      const {uid, type, page, tag} = route.params
      this.params = {
        uid: Number(uid),
        page: Number(page),
        type, tag, force
      }
      this.ready = true;
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>