<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header height="80px">
      <div id="作者信息">
        <el-row>
          <el-col :span="6">
            <div v-if="author" style="text-align: left">
              <user-avatar :size="60" :uid="author.id" />
              <user-link :size="30" :uid="author.id" />
              <user-follow-button :user="author" style="margin-left: 5px" />
            </div>
            <div v-else v-loading="!author" style="height:60px"></div>
          </el-col>
          <el-col :span="18" style="text-align: left">
            <el-radio-group v-model="label" size="large" @change="$router.push({name:$event,params:{page:1},query:$route.query})">
              <el-radio-button label="用户插画">插画 <span v-if="counts.illust>0">({{ counts.illust }})</span></el-radio-button>
              <el-radio-button label="用户漫画">漫画 <span v-if="counts.manga>0">({{ counts.manga }})</span></el-radio-button>
              <el-radio-button label="用户收藏">收藏 <span v-if="counts.bookmark>0">({{ counts.bookmark }})</span></el-radio-button>
            </el-radio-group>
            <el-pagination v-if="total>0"
                           v-model:current-page="page"
                           :page-size="48"
                           :total="total"
                           layout="prev, pager, next,jumper,total"
                           @current-change="$router.push({params:{page:$event}})"
                           hide-on-single-page
            />
          </el-col>

        </el-row>
      </div>
    </el-header>
    <el-main>
      <router-view @load-profile-all="loadProfileAll" />
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import UserAvatar from "@/components/user/UserAvatar";
import UserLink from "@/components/user/UserLink";
import UserFollowButton from "@/components/user/UserFollowButton";

export default {
  name: "User",
  components: {UserFollowButton, UserLink, UserAvatar},
  data() {
    return {
      author: undefined,
      counts: {
        illust: 0,
        manga: 0,
        bookmark: 0,
      },
      label: '',
      total: 0,
      page: 1,
    }
  },
  computed: {},
  methods: {
    ...mapActions("User", [`getUserInfo`, `getUserProfileAll`]),
    loadProfileAll(e) {
      const {illust, manga, bookmark, type} = e
      this.counts = Object.assign({}, this.counts, {illust, manga, bookmark})
      this.total = this.counts[type]
    },
    loadAuthorInfo(uid) {
      this.getUserInfo({uid}).then(res => {
        this.author = res;
      }).catch(reason => autoRetry(reason, () => this.loadAuthorInfo(uid)))
    },
    load(route) {
      if (route.path.startsWith('/user')) {
        this.page = Number(route.params.page)
        this.label = route.name
        this.author = undefined;

        const uid = Number(route.params.uid)

        this.loadAuthorInfo(uid)

      }
    },
  },
  mounted() {
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