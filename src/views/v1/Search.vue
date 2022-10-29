<template>
  <el-container v-loading="loading"
                :element-loading-spinner="svg" direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <!--  <el-container direction="horizontal">-->
    <el-header height="70px">
      <el-form @submit.prevent>
        <el-form-item>
          <el-input id="输入框" v-model="keyword" clearable size="small" style="max-width: 70%" @keyup.enter="route2Search(keyword)" />
          <el-button size="small" style="margin-left: 5px" type="primary" @click="route2Search(keyword)">搜索</el-button>
          <el-dropdown size="small" split-button style="margin-left: 5px" trigger="click" type="primary" @click="addKeyword(keyword)" @command="route2Search($event)">
            保存
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in config.search.keywords" :command="item.keyword">
                  <el-tooltip :content="item.keyword" placement="left">
                    <el-tag closable effect="dark" @close="delKeyword(item.label)">{{ item.label }}</el-tag>
                  </el-tooltip>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="dateRange" :shortcuts="dateShortcuts" clearable end-placeholder="结束日期" range-separator="到" size="small" start-placeholder="起始日期"
                          type="daterange"
                          unlink-panels
                          value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-pagination v-if="searchCount>0"
                     v-model:current-page="page"
                     :page-size="60"
                     :total="total"
                     hide-on-single-page
                     layout="prev, pager, next,jumper,total"
                     @current-change="$router.push({params:{page:$event},query:$route.query})"

      />
      <div v-if="relatedTags.length>0" v-show="config.search.relatedTags" id="相关标签" style="text-align: left">
        <el-divider content-position="left">相关标签</el-divider>
        <el-tag v-for="tag in relatedTags" effect="dark" style="margin-right: 3px">
          <el-tooltip content="or">
            <el-icon @click="keyword = `${keyword} or ${tag}`">
              <circle-plus-filled />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="and">
            <span class="clickable" @click="keyword = `${keyword} ${tag}`">{{ tag }}</span>
          </el-tooltip>
          <el-tooltip content="替换">
            <el-icon @click="route2Search(tag)">
              <d-arrow-right />
            </el-icon>
          </el-tooltip>
        </el-tag>
      </div>
      <div v-if="popularCount>0" v-show="config.search.popular" id="热门作品" style="text-align: left">
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
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/v1/illust/IllustCardDiv";
import {CirclePlusFilled, DArrowRight} from "@element-plus/icons-vue";

export default {
  name: "Search",
  components: {IllustCardDiv, CirclePlusFilled, DArrowRight},
  data() {
    return {
      keyword: "",
      page: 1,
      total: 100,
      loading: false,
      popularCount: 0,
      searchCount: 0,
      relatedTags: [],
      dateRange: [],
      dateShortcuts: [
        {text: "今天", value: () => this.getDateShortcuts(0)},
        {text: "最近2天", value: () => this.getDateShortcuts(1)},
        {text: "最近3天", value: () => this.getDateShortcuts(2)},
        {text: "最近7天", value: () => this.getDateShortcuts(6)},
        {text: "最近14天", value: () => this.getDateShortcuts(13)},
        {text: "最近30天", value: () => this.getDateShortcuts(29)},
      ],
    }
  },
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions('Search', [`getSearchResult`]),
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    ...mapMutations('Config', [`setConfig`, `addKeyword`, `delKeyword`]),
    getDateShortcuts(days) {
      const end = new Date()
      end.plusHours(1)
      const start = end.minusDays(days)
      return [start.toDate(), end.toDate()]
    },
    route2Search(keyword, page = 1, range = this.dateRange ? this.dateRange : []) {
      const [scd, ecd] = range;
      this.$router.push({name: "搜索结果", params: {keyword: keyword.trim(), page}, query: {scd, ecd}})
    },
    search(keyword = this.keyword, page = 1, force) {
      this.keyword = keyword
      this.page = Number(page);
      this.loading = true;
      this.searchCount = 1;
      this.popularCount = 1;
      const range = this.dateRange ? this.dateRange : []
      const [scd, ecd] = range;
      this.getSearchResult({keyword, page, force, scd, ecd}).then(res => {
        // console.log(res)
        const {popular, relatedTags, total, illusts} = res
        const {recent, permanent} = popular
        this.total = total
        this.relatedTags = relatedTags
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
    load(route, force) {
      if (!route.path.startsWith('/search')) {
        return;
      }
      const {keyword, page} = route.params
      const {scd, ecd} = route.query;
      this.dateRange = [scd, ecd]
      if (keyword && page) {
        this.search(keyword, page, force)
      }
    },
  },
  mounted() {
    setTitle("搜索")
    document.getElementById('输入框').focus()
    this.load(this.$route)
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