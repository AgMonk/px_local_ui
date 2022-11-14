<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <retry-div :params="params" :request="request" @failed="failed" @success="success">
        <!--        相关标签-->
        <div v-if="config.ui.showRelatedTags" style="text-align: left">
          <h4 style="color: white;margin-top: 5px;margin-bottom: 5px">相关标签</h4>
          <el-tag v-for="item in relatedTags" effect="dark" size="small" style="margin-right: 3px;margin-bottom: 3px" type="warning">
            <copy-span :text="item" />
          </el-tag>
        </div>

        <illust-card-group ref="cardGroup" style="margin-top: 10px" @request-refresh="refresh" />
      </retry-div>
    </el-main>
  </el-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import IllustCardGroup from "@/components/v2/illust/card/illust-card-group";
import {Title} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";
import CopySpan from "@/components/v2/copy/copy-span";

export default {
  name: "Illust",
  components: {CopySpan, IllustCardGroup},
  data() {
    return {
      params: {
        force: false,
        keyword: this.$route.params.keyword,
        params: this.$route.query
      },
      relatedTags: [],
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapActions("Illust", ['search']),
    //刷新请求
    refresh() {
      this.$refs.cardGroup.clear([])
      this.load(this.$route, true)
    },
    request(params) {
      return this.search(params)
    },
    //成功回调
    success(res) {
      const {data, total, popular, relatedTags} = res
      this.$emit("change-total", total);
      this.relatedTags = relatedTags;
      this.$nextTick(() => {
        this.$refs.cardGroup.clear(data, [...popular.recent, ...popular.permanent])
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    load(route, force) {
      this.params = {
        force,
        keyword: route.params.keyword,
        params: route.query,
      }
    }
  },
  mounted() {
    Title.set('搜索绘画')
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