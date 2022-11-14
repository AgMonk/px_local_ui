<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <!--搜索小说-->
      <retry-div :params="params" :ready="ready" :request="request" @failed="failed" @success="success">
        <!--        相关标签-->
        <div v-if="config.ui.showRelatedTags" style="text-align: left">
          <h4 style="color: white;margin-top: 5px;margin-bottom: 5px">相关标签</h4>
          <el-tag v-for="item in relatedTags" effect="dark" size="small" style="margin-right: 3px;margin-bottom: 3px" type="warning">
            <copy-span :text="item" />
          </el-tag>
        </div>
        <novel-card-group ref="cardGroup" />
      </retry-div>
    </el-main>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";
import {routeName} from "@/router/route-name";
import {mapActions, mapState} from "vuex";
import NovelCardGroup from "@/components/v2/novel/card/novel-card-group";
import CopySpan from "@/components/v2/copy/copy-span";

export default {
  name: "Novel",
  components: {CopySpan, NovelCardGroup},
  data() {
    return {
      ready: false,
      params: {
        force: false,
      },
      relatedTags: [],
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapActions("Novel", ['search']),
    request(params) {
      return this.search(params)
    },
    //成功回调
    success(res) {
      console.log(res)
      const {data, total, relatedTags} = res
      this.$emit("change-total", total);
      this.relatedTags = relatedTags;
      this.$nextTick(() => {
        this.$refs.cardGroup.clear(data)
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
      this.ready = true;
    }
  },
  mounted() {
    Title.set(routeName.search.novel)
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === routeName.search.novel) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>