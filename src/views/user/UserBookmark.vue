<template>
  <el-container v-loading="loading" :element-loading-spinner="svg"
                direction="vertical"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                element-loading-svg-view-box="-10, -10, 50, 50"
                element-loading-text="加载中..."
  >
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-form inline>
        <el-form-item v-if="config.uid===params.uid">
          <el-radio-group v-model="query.show" @change="pushRoute">
            <el-radio-button label="show">公开</el-radio-button>
            <el-radio-button label="hide">不公开</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="默认只显示数量最多的前20个标签，请输入关键字搜索" placement="top">
            <el-select v-if="tags.pub.length>0 && query.show==='show'" v-model="query.tag" :filter-method="tagFilter" clearable filterable placeholder="公开标签" @change="pushRoute">
              <el-option
                  v-for="item in tagSelector.pub"
                  :key="item.tag"
                  :label="`${item.tag}(${item.cnt})`"
                  :value="item.tag"
              >
              </el-option>
            </el-select>
            <el-select v-if="tags.pri.length>0 && query.show==='hide'" v-model="query.tag" clearable filterable placeholder="私有标签">
              <el-option
                  v-for="item in tagSelector.pri"
                  :key="item.tag"
                  :label="`${item.tag}(${item.cnt})`"
                  :value="item.tag"
              >
              </el-option>
            </el-select>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main style="text-align: left">
      <illust-card-div ref="card-div" :disable-group="config.uid===params.uid" @refresh="load($route, true)" />
      <div v-if="loading" style="height:300px"></div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {autoRetry} from "@/assets/js/utils/RequestUtils";
import IllustCardDiv from "@/components/illust/IllustCardDiv";
import {setTitle} from "@/assets/js/request/request";

export default {
  name: "UserBookmark",
  components: {IllustCardDiv},
  data() {
    return {
      params: {
        page: 1,
        uid: 0,
      },
      query: {
        show: 'show',
        tag: '',
      },
      tags: {
        pub: [],
        pri: [],
      },
      tagSelector: {
        pub: [],
        pri: [],
      },
      loading: false,
    }
  },
  emits: ['load-profile-all'],
  computed: {
    ...mapState("Loading", [`svg`]),
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("User", [`getUserBookmark`, `getUserBookmarkTags`]),
    pushRoute() {
      this.$router.push({name: '用户收藏', params: this.params, query: this.query})
    },
    tagFilter(value) {
      const key = this.query.show === 'show' ? 'pub' : 'pri';
      if (value) {
        this.tagSelector[key] = this.tags[key].filter(i => i.tag.includes(value))
      } else {
        this.tagSelector[key] = this.tags[key].slice(0, Math.min(this.tags[key].length, 20))
      }
    },
    loadUserBookmark(force) {
      this.loading = true;
      this.getUserBookmark(Object.assign({}, this.params, this.query, {force})).then(res => {
        this.loading = false;
        this.$refs['card-div'].clear(res.illusts)
        this.$emit('load-profile-all', {bookmark: res.total, type: 'bookmark'})
      }).catch(reason => autoRetry(reason, () => this.loadUserBookmark(force)))
    },
    loadUserBookmarkTags(force) {
      this.getUserBookmarkTags({uid: this.params.uid, force}).then(res => {
        this.tags = res
        this.tagSelector.pub = res.pub.slice(0, Math.min(res.pub.length, 20))
        this.tagSelector.pri = res.pri.slice(0, Math.min(res.pri.length, 20))
      }).catch(reason => autoRetry(reason, () => this.loadUserBookmarkTags(force)))
    },
    load(route, force) {
      if (route.name === '用户收藏') {
        this.params.uid = Number(route.params.uid)
        this.params.page = Number(route.params.page)
        this.query.tag = route.query.tag ? route.query.tag : '';
        this.query.show = route.query.show ? route.query.show : 'show';
        this.loadUserBookmark(force)
        this.loadUserBookmarkTags(force)
      }
    },
  },
  mounted() {
    setTitle("用户收藏")
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