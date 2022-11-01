<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main style="padding: 0 20px">
      <!--      搜索选项-->
      <div style="text-align: left">

        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-radio-group v-model="type" size="small" type="primary">
              <el-radio-button label="illust">绘画</el-radio-button>
              <el-radio-button label="novel">小说</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button size="small" type="primary">搜索</el-button>
          </el-col>
        </el-row>
        <!--      搜索框-->
        <el-input v-model="keyword" placeholder="请输入关键字" size="small" />
        <!--        搜索条件 -->
        <div>
          <el-form inline size="small">
            <el-form-item>
              <template #label><span class="form-label">模式</span></template>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">日期(起)</span></template>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">日期(止)</span></template>
            </el-form-item>
          </el-form>
          <el-form v-if="type==='novel'" inline size="small">
            <el-form-item>
              <template #label><span class="form-label">匹配模式</span></template>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">按系列分组</span></template>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">最小字数</span></template>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">最大字数</span></template>
            </el-form-item>
          </el-form>
        </div>
        <!--      todo 搜索筛选条件 模式 日期-->

      </div>
      <!--      todo 翻页-->
      <!--      todo 已保存的搜索 -->
      <router-view />
      <!--      todo 翻页-->
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";

export default {
  name: "Home",
  data() {
    return {
      type: undefined,
      keyword: undefined,
      //参数
      params: {
        //公共参数
        common: {
          page: undefined,
          mode: undefined,
          scd: undefined,
          ecd: undefined,
        },
        //小说专用参数
        novel: {
          s_mode: undefined,
          gs: 0,
          tgt: undefined,
          tlt: undefined,
        },
      },
    }
  },
  computed: {},
  methods: {
    load(route) {
      console.log(route)
      const {keyword, page, type} = route.params
      const {mode, scd, ecd, s_mode, gs, tgt, tlt} = route.query

      //同步查询参数

      //通用参数
      this.type = type;
      this.keyword = keyword

      const common = this.params.common
      common.page = Number(page);
      common.mode = mode || "all";
      common.scd = scd;
      common.ecd = ecd;

      //小说参数
      const novel = this.params.novel
      novel.s_mode = s_mode || 's_tag';
      novel.gs = gs ? 1 : 0;
      novel.tgt = tgt ? Number(tgt) : undefined;
      novel.tlt = tlt ? Number(tlt) : undefined;
    }
  },
  mounted() {
    Title.set("搜索")
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name.startsWith('搜索')) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>
.form-label {
  color: white;
}
</style>