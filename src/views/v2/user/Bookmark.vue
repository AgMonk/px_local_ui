<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header style="color:white">

      <el-row>
        <el-col :span="12" style="text-align: left">
          <el-radio-group v-model="params.type" size="small" type="primary" @change="changeType">
            <el-radio-button label="illust">绘画</el-radio-button>
            <el-radio-button label="novel">小说</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12" style="text-align: right">
          <user-bookmark-tag v-if="ready"
                             :rest="params.rest"
                             :type="params.type"
                             :uid="Number($route.params.uid)"
                             :value="params.tag"
                             @change="changeTag"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <retry-div :params="params" :ready="ready" :request="request" unmount-while-loading @failed="failed" @success="success">
        <el-pagination v-model:current-page="params.page"
                       :layout="layout"
                       :page-size="params.size"
                       :total="total"
                       hide-on-single-page
                       size="small"
                       @current-change="changePage"
        />
        <illust-card-div v-if="params.type==='illust'" :data="data.illust" />
        <novel-card-div v-if="params.type==='novel'" :data="data.novel" />
      </retry-div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {routeName} from "@/router/route-name";
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";
import IllustCardDiv from "@/components/v2/illust/card/illust-card-div";
import NovelCardDiv from "@/components/v2/novel/card/novel-card-div";
import UserBookmarkTag from "@/components/v2/user/user-bookmark-tag";

//用户收藏
const name = routeName.user.bookmark

export default {
  name: "Bookmark",
  components: {UserBookmarkTag, NovelCardDiv, IllustCardDiv},
  data() {
    return {
      params: {
        //作品类型 'illust' 或 'novel'
        type: undefined,
        page: undefined,
        size: undefined,
        tag: undefined,
        rest: undefined,
        force: false,
      },
      data: {
        illust: [],
        novel: [],
      },
      layout: "prev, pager, next, jumper,total",
      total: undefined,
      ready: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Bookmarks", ["illust", "novel"]),
    changeTag(e) {
      this.params.tag = e
      this.changePage();
    },
    changeType() {
      this.params.tag = ""
      this.params.page = 1
      this.pushRoute(this.params)
    },
    changePage() {
      this.pushRoute(this.params)
    },
    //请求
    request({type, page, size, tag, rest, force}) {
      const method = type === 'illust' ? this.illust : this.novel;
      const uid = Number(this.$route.params.uid)
      return method({force, uid, param: {page, size, tag, rest}})
    },
    //成功回调
    success({type, data, total}) {
      if (this.params.type !== type) {
        return;
      }
      this.data[type] = data
      this.total = total
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //跳转路由
    pushRoute({type, page, size, tag, rest,}) {
      this.$router.push({query: {type, page, size, tag, rest,}})
    },
    //路由切换时修改参数
    load(route, force) {
      Title.set(route.name)
      const query = route.query;
      const type = query.type || 'illust';
      const page = Number(query.page || 1);
      const size = Number(query.size || 48);
      const tag = query.tag || ''
      const rest = query.rest || 'show'

      this.params = {type, page, size, tag, rest, force}

      this.ready = true;
    }
  },
  mounted() {
    this.load(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name.startsWith(name)) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>