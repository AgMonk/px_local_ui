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
        <el-input v-model="keyword" placeholder="请输入关键字" size="small" style="margin-top: 5px" />
        <!--        搜索条件 -->
        <div style="margin-top: 5px">
          <!--          通用条件-->
          <el-form inline size="small">
            <el-form-item>
              <template #label><span class="form-label">模式</span></template>
              <el-select v-model="params.common.mode" effect="dark" style="width: 80px">
                <el-option v-for="item in modes" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">日期范围</span></template>
              <el-date-picker
                  v-model="dateRange"
                  :shortcuts="dateRangeShortCuts"
                  end-placeholder="结束日期"
                  range-separator="到"
                  start-placeholder="起始日期"
                  type="daterange"
                  unlink-panels
                  value-format="YYYY-MM-DD"
                  @change="dateRangeChanged"
              />
            </el-form-item>
          </el-form>
          <!--          小说条件-->
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
      <div>
        <!--      todo 已保存的搜索 -->
      </div>
      <div>
        <el-pagination v-model:current-page="params.common.page"
                       :layout="layout"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
        <router-view @change-total="total=$event" />
        <el-pagination v-model:current-page="params.common.page"
                       :layout="layout"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
      </div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {DateUtils} from "gin-utils/dist/utils/DateUtils";

const getDate = () => {
  return DateUtils.withZone(new Date(), 9)
}
const getDateRange = (days) => {
  let end = getDate();
  let start = DateUtils.plusDays(end, -1 * days)
  return [
    DateUtils.format(start, "yyyy-MM-dd"),
    DateUtils.format(end, "yyyy-MM-dd"),
  ]
}

export default {
  name: "Home",
  data() {
    return {
      total: 100,
      layout: "prev, pager, next, jumper",
      modes: [
        {label: "全部", value: "all"},
        {label: "R18", value: "r18"},
        {label: "安全", value: "safe"},
      ],
      dateRange: [],
      //日期快捷选项
      dateRangeShortCuts: [
        {text: '今天', value: () => getDateRange(0),},
        {text: '最近2天', value: () => getDateRange(1),},
        {text: '最近3天', value: () => getDateRange(2),},
        {text: '最近1周', value: () => getDateRange(6),},
        {text: '最近2周', value: () => getDateRange(13),},
        {text: '最近30天', value: () => getDateRange(29),},
      ],
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
    changePage(page) {
      console.log(page)
    },
    dateRangeChanged(e) {
      const c = this.params.common
      if (e) {
        console.log("选择日期", e[0], e[1])
        c.scd = e[0];
        c.ecd = e[1];
      } else {
        c.scd = undefined;
        c.ecd = undefined;
      }
    },
    load(route) {
      console.log(route)
      const {keyword, page, type} = route.params
      const {mode, scd, ecd, s_mode, gs, tgt, tlt} = route.query

      //同步查询参数

      //通用参数
      this.type = type;
      this.keyword = keyword

      const common = this.params.common
      common.page = page ? Number(page) : 1;
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