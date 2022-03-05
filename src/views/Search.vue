<template>
  <el-container v-loading="loading"
                :element-loading-spinner="svg" direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-form @submit.prevent>
        <el-form-item>
          <el-input id="输入框" v-model="keyword" clearable size="small" style="max-width: 70%" @keyup.enter="route2Search(keyword)" />
          <el-button size="small" style="margin-left: 5px" type="primary" @click="route2Search(keyword)">搜索</el-button>
          <el-dropdown size="small" split-button style="margin-left: 5px" type="primary" @click="saveKeyword" @command="route2Search($event)">
            保存
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in savedKeywords" :command="item.keyword">{{ item.label }}
                                                                                        <!--                todo 移除搜索-->
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-pagination v-model:current-page="page"
                     v-if="searchCount>0"
                     :page-size="60"
                     :total="total"
                     layout="prev, pager, next,jumper,total"
                     @current-change="$router.push({params:{page:$event}})"

      />
      <div id="相关标签"><!--todo--></div>
      <div v-if="popularCount>0" id="热门作品" style="text-align: left">
        <el-divider content-position="left">热门作品</el-divider>
        <illust-card-div ref="popular-result" :height="207" :show-date-range="false" disable-refresh />
      </div>
      <div v-if="searchCount>0" id="搜索结果" style="text-align: left">
        <el-divider content-position="left">搜索结果</el-divider>
        <illust-card-div ref="search-result" @refresh="load($route, true)" />
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {setTitle} from "@/assets/js/request/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {mapActions, mapGetters, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/illust/IllustCardDiv";

export default {
  name: "Search",
  components: {IllustCardDiv},
  data() {
    return {
      keyword: "",
      page: 1,
      savedKeywords: [],
      scd: undefined,
      ecd: undefined,
      total: 100,
      loading: false,
      popularCount: 0,
      searchCount: 0,
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState("Config", [`config`]),

  },
  methods: {
    ...mapActions('Search', [`getSearchResult`]),
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    route2Search(keyword, page = 1) {
      this.$router.push({name: "搜索结果", params: {keyword, page}})
    },
    search(keyword = this.keyword, page = 1, force) {
      this.keyword = keyword
      this.page = Number(page);
      this.loading = true;
      this.searchCount = 1;
      this.popularCount = 1;
      this.getSearchResult({keyword, page, force, scd: this.scd, ecd: this.ecd}).then(res => {
        console.log(res)
        const {popular, relatedTags, total, illusts} = res
        const {recent, permanent} = popular
        this.total = total
        const array = illusts.map(i => i.id);
        this.searchCount = array.length
        if (this.searchCount > 0) {
          this.$refs['search-result'].clear(array)
        }

        const p = [...recent, ...permanent].map(i => i.id);
        this.popularCount = p.length;
        if (this.popularCount > 0) {
          this.$refs['popular-result'].clear(p)
        }

        this.loading = false;

      }).catch(reason => autoRetry(reason, () => this.search(keyword, page, force)))
    },
    saveKeyword() {
      ElMessageBox.prompt('保存名称', {}).then(res => {
        const {value, action} = res
        if (action === 'confirm') {
          //todo 保存时过滤label相同的快捷搜索
          //todo 保存后排序
          this.savedKeywords.push({label: value, keyword: this.keyword})
          ElMessage.success("已保存搜索")

          /*todo 保存快捷搜索到config*/
        }
      }).catch(reason => {
        if (reason === 'cancel') {
          ElMessage.info("已取消")
        } else {
          console.log(reason)
          ElMessage.error("无法识别")
        }
      })
    },
    load(route, force) {
      if (!route.path.startsWith('/search')) {
        return;
      }
      const {keyword, page} = route.params
      if (keyword && page) {
        this.search(keyword, page, force)
      }
    },
  },
  mounted() {
    setTitle("搜索")
    document.getElementById('输入框').focus()
    this.load(this.$route)

    /*todo 从config加载快捷搜索*/
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