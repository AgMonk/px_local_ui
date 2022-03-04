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
                <el-dropdown-item v-for="item in savedKeywords" :command="item.keyword">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-pagination v-model:current-page="page"
                     :page-size="60"
                     :total="total"
                     layout="prev, pager, next,jumper"
                     @current-change="$router.push({params:{page:$event}})"

      />
      <el-main style="text-align: left">
        <illust-card-div ref="card-div" @refresh="load($route, true)" />
      </el-main>
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
      this.getSearchResult({keyword, page, force, scd: this.scd, ecd: this.ecd}).then(res => {
        console.log(res)
        this.total = res.total
        const array = res.illusts.filter(item => !this.config.filterBookmarked || !this.getIllustFromCache()(item.id).bmkData).map(i => i.id);
        this.$refs['card-div'].clear(array)
        this.loading = false;

      }).catch(reason => autoRetry(reason, () => this.search(keyword, page, force)))
    },
    saveKeyword() {
      ElMessageBox.prompt('保存名称', {}).then(res => {
        const {value, action} = res
        if (action === 'confirm') {
          this.savedKeywords.push({label: value, keyword: this.keyword})
          ElMessage.success("已保存搜索")
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