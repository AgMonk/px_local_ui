<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header>{{ pid }}</el-header>-->
    <el-main v-loading="loading" style="min-height: 500px;max-height: 800px">
      <div v-if="failed" style="color:white;cursor: pointer" @click="refresh">
        <h3>请求失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-else style="min-height: 500px;max-height: 800px">
        <el-container v-if="data" direction="horizontal">
          <!--          主界面-->
          <el-main style="background-color: rgba(1,48,133,0.3)">
            <el-tabs v-if="showTabs" v-model="activeIndex" stretch tab-position="left">
              <el-tab-pane v-for="index in data.pageCount" :name="index-1" lazy>
                <template #label>
                  <el-image :src="getUrl('small',index-1)" lazy style="height:40px;">
                    <template #placeholder>
                      <span style="color: white" v-text="index-1"></span>
                    </template>
                  </el-image>
                </template>
                <el-image :initial-index="index-1"
                          :preview-src-list="original"
                          :src="getUrl('regular',index-1)"
                          :style="{
                            height: Math.min(800,data.size.height)+'px'
                          }"
                          fit="scale-down"
                          preview-teleported
                >
                  <template #placeholder>
                    <el-icon :size="100" class="is-loading" color="white" style="margin-top: 100px">
                      <Loading />
                    </el-icon>
                  </template>
                </el-image>
              </el-tab-pane>
            </el-tabs>
          </el-main>
          <!--          右侧边-->
          <el-aside style="width: 280px;padding-left: 20px;padding-right: 20px">
            <div>
              <!--            用户头像-->
              <user-title :uid="data.userId" />
            </div>

            <div style="display: flex; justify-content: space-between">
              <span style="color: chartreuse;margin-left: 3px">其他作品</span>
              <span style="margin-right: 3px">
                <router-link :to="{name:'用户主页',params:{uid:data.userId}}">
                  <el-link :underline="false" type="success">
                    作品列表
                  </el-link>
                </router-link>
              </span>
            </div>
            <div>
              <illust-image v-for="info in others" :info="info" :size="80" />
              <!--              <illust-card v-for="info in others" :info="info" :size="80" disable-author disable-title />-->
            </div>

          </el-aside>

        </el-container>

        <!--  todo       操作栏 喜欢、收藏-->
        <div></div>
        <!--       todo 标题和描述 -->
        <div></div>
        <!--        todo 标签-->
        <div></div>
        <!--        todo 数据统计-->
        <div></div>
        <!--        todo 时间戳-->
        <div></div>
        <!--        todo 评论区-->
        <div></div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {Title} from "gin-utils/dist/utils/DomUtils";
import IllustCard from "@/components/v2/illust/illust-card";
import IllustImage from "@/components/v2/illust/illust-image";
import {Loading} from "@element-plus/icons-vue";
import UserTitle from "@/components/v2/user/user-title";

export default {
  name: "Illust",
  components: {UserTitle, IllustImage, IllustCard, Loading},
  data() {
    return {
      activeIndex: 0,
      loading: false,
      showTabs: false,
      failed: false,
      data: undefined,
      others: [],
      pid: undefined,
      original: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ['detail']),
    ...mapGetters("User", ['getUser']),
    refresh() {
      this.load(this.$route)
    },
    getUrl(type, index) {
      return this.data.urls[type].replace('https://i.pximg.net', '/pximg').replace("_p0", "_p" + index)
    },
    load(route, force) {
      const {pid} = route.params
      this.pid = pid
      this.loading = true
      this.detail({pid, force}).then(res => {
        console.log(res)
        this.failed = false
        this.showTabs = false;
        this.data = res;
        this.activeIndex = 0;
        this.others = res.otherIllustIds.map(id => {
          return {id, showImage: true}
        })

        this.original = []
        for (let i = 0; i < this.data.pageCount; i++) {
          this.original.push(this.getUrl("original", i))
        }
        //等渲染完成了再加载tabs 避免从图片多的作品切换到少的作品时无畏的404请求
        this.$nextTick(() => {
          this.showTabs = true;
        })
      }).catch(e => {
        console.error(e)
        this.failed = true
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    Title.set("作品详情")
    this.refresh()
  },
  watch: {
    $route(to) {
      if (to.name === '绘画详情') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>