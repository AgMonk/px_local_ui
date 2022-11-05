<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main style="padding: 0 20px">
      <!--      搜索选项-->
      <div style="text-align: left">

        <el-row>
          <el-col :span="8" style="text-align: left">
            <el-radio-group v-model="type" size="small" type="primary" @change="pushRoute">
              <el-radio-button label="illust">绘画</el-radio-button>
              <el-radio-button label="novel">小说</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <span v-if="params.common.scd || params.common.ecd" style="color: white ;margin: 0;">日期范围: {{ params.common.scd }} ~ {{ params.common.ecd }}</span>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-dropdown size="small" split-button style="margin-right: 5px" type="primary" @click="showSaveSearchDialog" @command="choseSavedSearch">
              保存
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-for="(param,index) in config.search[type]" :command="param.command">
                    <el-tag closable effect="dark" size="small" @close="removeSavedSearch(index)">{{ param.title }}</el-tag>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button size="small" type="primary" @click="showDialog ">筛选条件</el-button>
            <el-button size="small" type="primary" @click="params.common.p=1;pushRoute()">搜索</el-button>
          </el-col>
        </el-row>
        <!--      搜索框-->
        <el-input v-model="keyword" placeholder="请输入关键字" size="small" style="margin-top: 5px" @keyup.enter="params.common.p=1;pushRoute()" />
      </div>
      <div>
        <!--      已保存的搜索 -->
      </div>
      <div v-if="$route.name!=='搜索'">
        <!--        翻页-->
        <el-pagination v-model:current-page="params.common.p"
                       :layout="layout"
                       :page-size="size"
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
                       :page-size="size"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
      </div>


      <el-dialog v-model="dialog.search" append-to-body title="保存搜索">
        <el-form v-if="dialog.search" label-width="80px" size="small" @submit.prevent>
          <el-form-item>
            <template #label><span class="form-label">标题</span></template>
            <el-autocomplete ref="search-form-title"
                             v-model="searchForm.title"
                             :fetch-suggestions="fetchSuggestions"
                             clearable
                             placeholder="请输入标题"
                             @keyup.enter="saveSearch"
            />
          </el-form-item>
          <el-form-item>
            <template #label><span class="form-label">日期快捷项</span></template>
            <el-select v-model="searchForm.command.dateShortcut">
              <el-option v-for="item in dateRangeShortCuts" :label="item.text" :value="item.text" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label><span class="form-label">关键字</span></template>
            <el-input v-model="searchForm.command.keyword" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="success" @click="saveSearch">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog v-model="dialog.filter" append-to-body title="筛选条件">
        <!--          通用条件-->
        <el-form label-position="left" size="small">
          <el-form-item>
            <template #label><span class="form-label">模式</span></template>
            <el-select v-model="tempParams.common.mode" effect="dark" style="width: 80px">
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
        <el-form v-if="type==='novel'" size="small">
          <el-form-item>
            <template #label><span class="form-label">检索范围</span></template>
            <el-select v-model="tempParams.novel.s_mode" effect="dark" style="width: 120px">
              <el-option v-for="item in s_modes" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label><span class="form-label">按系列分组</span></template>
            <el-radio-group v-model="tempParams.novel.gs" size="small" type="primary">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <template #label><span class="form-label">最小字数</span></template>
            <el-select v-model="tempParams.novel.tlt" :clearable="true" effect="dark" style="width: 120px">
              <el-option v-for="item in tlts" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <template #label><span class="form-label">最大字数</span></template>
            <el-select v-model="tempParams.novel.tgt" :clearable="true" effect="dark" style="width: 120px">
              <el-option v-for="item in tgts" :label="item" :value="item" />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="submit">提交</el-button>
      </el-dialog>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {DomUtils, Title} from "gin-utils/dist/utils/DomUtils";
import {DateUtils} from "gin-utils/dist/utils/DateUtils";
import {ObjectUtils} from "gin-utils/dist/utils/ObjectUtils";
import {mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

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
      dialog: {
        filter: false,
        search: false,
      },
      //即将保存的搜索参数
      searchForm: undefined,
      size: 60,
      total: 6000,
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
      tempParams: {},
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapMutations("Config", ['saveConfig', 'addSearch', 'delSearch']),
    removeSavedSearch(index) {
      console.log(index)
      ElMessageBox.confirm(`确认删除搜索：${this.config.search[this.type][index].title} ?`, "确认删除").then(() => {
        this.delSearch({type: this.type, index})
        ElMessage.success("删除成功")
      })
    },
    choseSavedSearch({keyword, dateShortcut}) {
      console.debug('选中已保存的搜索', keyword)
      this.keyword = keyword
      if (dateShortcut) {
        let array = this.dateRangeShortCuts.filter(i => i.text === dateShortcut)
        if (array.length > 0) {
          let range = array[0].value()
          this.params.common.scd = range[0]
          this.params.common.ecd = range[1]
        }
      }

      this.pushRoute()
    },
    fetchSuggestions(s, cb) {
      let array = this.config.search[this.type].map(i => i.title)
      cb(array.filter(i => i.includes(s)).map(value => {
        return {value}
      }))
    },
    saveSearch() {
      this.addSearch({type: this.type, data: this.searchForm})
      this.dialog.search = false;
      ElMessage.success("添加成功")
    },
    submit() {
      this.params = ObjectUtils.clone(this.tempParams)
      this.dialog.filter = false
      this.pushRoute();
    },
    showSaveSearchDialog() {
      this.dialog.search = true;
      this.searchForm = {
        title: undefined,
        command: {
          keyword: this.keyword,
          dateShortcut: undefined,
        }
      }
      console.log('保存搜索参数')
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs['search-form-title'].focus()
        }, 50)
      })
    },
    showDialog() {
      this.tempParams = ObjectUtils.clone(this.params)
      const {scd, ecd} = this.params.common
      this.dateRange = [scd, ecd]
      this.dialog.filter = true;
    },
    //跳转路由
    pushRoute() {
      if (!this.keyword || this.keyword.length === 0) {
        return;
      }
      const {common, novel} = this.params
      const params = {keyword: this.keyword}
      const query = Object.assign({}, common, this.type === 'novel' ? novel : {})
      const name = this.type === 'novel' ? '搜索小说' : '搜索绘画';
      // noinspection JSCheckFunctionSignatures
      this.$router.push({name, params, query})
    },
    //翻页
    changePage(page) {
      DomUtils.scrollYToTop();
      this.params.common.p = page
      this.pushRoute()
    },
    //修改选择日期
    dateRangeChanged(e) {
      const c = this.tempParams.common
      if (e) {
        console.log("选择日期", e[0], e[1])
        c.scd = e[0];
        c.ecd = e[1];
      } else {
        c.scd = undefined;
        c.ecd = undefined;
      }
    },
    //从路由中加载参数
    load(route) {
      const {keyword,} = route.params
      const {mode, scd, ecd, s_mode, gs, tgt, tlt, p} = route.query

      this.dialog.filter = false
      //同步查询参数

      //路径参数
      this.type = route.path.split('/')[2] || 'illust';
      this.keyword = keyword

      //通用参数
      const common = this.params.common
      common.p = p ? Number(p) : 1;
      common.mode = mode || "all";
      common.scd = scd;
      common.ecd = ecd;
      this.dateRange = [scd, ecd]

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