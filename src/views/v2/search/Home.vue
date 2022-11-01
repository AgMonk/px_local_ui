<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main style="padding: 0 20px">
      <!--      搜索选项-->
      <div style="text-align: left">

        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-radio-group v-model="type" size="small" type="primary" @change="pushRoute">
              <el-radio-button label="illust">绘画</el-radio-button>
              <el-radio-button label="novel">小说</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button size="small" type="primary" @click="pushRoute">搜索</el-button>
          </el-col>
        </el-row>
        <!--      搜索框-->
        <el-input v-model="keyword" placeholder="请输入关键字" size="small" style="margin-top: 5px" @keyup.enter="pushRoute" />
        <!--        搜索条件 -->
        <div style="margin-top: 5px">
          <!--          通用条件-->
          <el-form inline label-position="left" size="small">
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
          <!--        todo  小说条件-->
          <el-form v-if="type==='novel'" inline size="small">
            <el-form-item>
              <template #label><span class="form-label">检索范围</span></template>
              <el-select v-model="params.novel.s_mode" effect="dark" style="width: 120px">
                <el-option v-for="item in s_modes" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">按系列分组</span></template>
              <el-radio-group v-model="params.novel.gs" size="small" type="primary">
                <el-radio-button :label="1">是</el-radio-button>
                <el-radio-button :label="0">否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">最小字数</span></template>
              <el-select v-model="params.novel.tlt" :clearable="true" effect="dark" style="width: 120px">
                <el-option v-for="item in tlts" :label="item" :value="item" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <template #label><span class="form-label">最大字数</span></template>
              <el-select v-model="params.novel.tgt" :clearable="true" effect="dark" style="width: 120px">
                <el-option v-for="item in tgts" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <!--      todo 已保存的搜索 -->
      </div>
      <div v-if="$route.name!=='搜索'">
        <!--        翻页-->
        <el-pagination v-model:current-page="params.common.p"
                       :layout="layout"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
        <!--        子路由-->
        <router-view @change-total="total=$event" />
        <!--        翻页-->
        <el-pagination v-model:current-page="params.common.p"
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
      tlts: [0, 5000, 20000, 80000],
      tgts: [4999, 19999, 79999],
      modes: [
        {label: "全部", value: "all"},
        {label: "R18", value: "r18"},
        {label: "安全", value: "safe"},
      ],
      s_modes: [
        {label: "默认", value: "s_tag"},
        {label: "标签、部分一致", value: "s_tag_only"},
        {label: "标签，完全一致", value: "s_tag_full"},
        {label: "正文", value: "s_tc"},
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
          p: undefined,
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
    //跳转路由
    pushRoute() {
      const {common, novel} = this.params
      const params = {keyword: this.keyword}
      const query = Object.assign({}, common, this.type === 'novel' ? novel : {})
      const name = this.type === 'novel' ? '搜索小说' : '搜索绘画';
      // noinspection JSCheckFunctionSignatures
      this.$router.push({name, params, query})
    },
    //翻页
    changePage(page) {
      const common = this.params.common
      common.p = page
      this.pushRoute()
    },
    //修改选择日期
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
      this.pushRoute()
    },
    //从路由中加载参数
    load(route) {
      console.log(route)
      const {keyword, page,} = route.params
      const {mode, scd, ecd, s_mode, gs, tgt, tlt} = route.query
      console.log(route.query)

      //同步查询参数

      //路径参数
      this.type = route.path.split('/')[2] || 'illust';
      this.keyword = keyword

      //通用参数
      const common = this.params.common
      common.p = page ? Number(page) : 1;
      common.mode = mode || "all";
      common.scd = scd;
      common.ecd = ecd;

      //小说参数
      const novel = this.params.novel
      novel.s_mode = s_mode || 's_tag';
      novel.gs = (!gs || gs === '0') ? 0 : 1;
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