<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header>{{ pid }}</el-header>-->
    <el-main v-loading="loading" style="min-height: 500px;">
      <div v-if="failed" style="color:white;cursor: pointer" @click="refresh">
        <h3>请求失败</h3>
        <h4>点击刷新</h4>
      </div>
      <div v-else style="min-height: 500px;margin-left: 20px;margin-right: 20px">
        <!--        主界面和右侧边-->
        <el-container v-if="data" direction="horizontal">
          <!--          主界面-->
          <el-main style="background-color: rgba(1,48,133,0.3);">
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
          <el-aside style="width: 280px;padding-left: 20px;">
            <div>
              <!--            用户头像-->
              <user-title :uid="data.userId" />
            </div>

            <div style="display: flex; justify-content: space-between">
              <span style="color: chartreuse;margin-left: 3px">其他作品</span>
              <span style="margin-right: 3px">
                <router-link :to="{name:'用户',params:{uid:data.userId}}">
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
            <el-descriptions :column="1" border style="margin-top: 10px">
              <el-descriptions-item label="收藏">
                <illust-bookmark-button :pid="data.id" empty-color="black" />
                ({{ data.bookmarkCount }})
              </el-descriptions-item>
              <el-descriptions-item label="喜欢">
                <el-icon v-if="liking" :size="25" class="is-loading">
                  <Loading />
                </el-icon>
                <el-icon v-else-if="data.likeData" :size="25" color="red">
                  <SuccessFilled />
                </el-icon>
                <el-icon v-else :size="25" style="cursor: pointer" @click="like">
                  <QuestionFilled />
                </el-icon>
                ({{ data.likeCount }})
              </el-descriptions-item>
              <el-descriptions-item label="浏览">
                {{ data.viewCount }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ data.createDate }}
              </el-descriptions-item>
              <el-descriptions-item v-if="data.createDate!==data.uploadDate" label="上传时间">
                {{ data.uploadDate }}
              </el-descriptions-item>
              <el-descriptions-item label="尺寸">{{ data.size.width }}x{{ data.size.height }}</el-descriptions-item>
              <el-descriptions-item v-if="data.isCommission" label="约稿人">
                <div v-if="data.commissionFrom">
                  <user-avatar :uid="data.commissionFrom.id" />
                  <user-link :uid="data.commissionFrom.id" />
                </div>
                <div v-else>匿名约稿</div>
              </el-descriptions-item>
              <el-descriptions-item label="Aria2">
                <!--                todo 下载原图-->
                <el-button size="small" type="success" @click="aria2Download">下载</el-button>
              </el-descriptions-item>

            </el-descriptions>
          </el-aside>

        </el-container>

        <!--        底部信息-->
        <div v-if="data">

          <!--       标题和描述 -->
          <div style="color: white;text-align: left">
            <illust-link :pid="pid">
              <h2 style="color: white;">
                {{ data.title ? data.title : '无标题' }}
              </h2>
            </illust-link>
            <div v-html="data.description" />
          </div>
          <!--         标签-->
          <div style="text-align: left;margin-top: 20px">
            <block-tag-button :tags="data.tags" style="margin-right: 5px" />
            <illust-tag v-for="item in data.tags" :tag="item" />
            <!--            todo 追加标签-->
          </div>
          <!--        评论区-->
          <div v-if="data.commentCount>0">
            <illust-comment-area :pid="data.id" />
          </div>

          <!--          todo 推荐作品-->
        </div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import {Title} from "gin-utils/dist/utils/DomUtils";
import IllustCard from "@/components/v2/illust/card/illust-card";
import IllustImage from "@/components/v2/illust/illust-image";
import {Loading, QuestionFilled, SuccessFilled} from "@element-plus/icons-vue";
import UserTitle from "@/components/v2/user/user-title";
import IllustBookmarkButton from "@/components/v2/illust/illust-bookmark-button";
import IllustLink from "@/components/v2/illust/illust-link";
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import IllustTag from "@/components/v2/illust/illust-tag";
import IllustCommentArea from "@/components/v2/illust/comment/illust-comment-area";
import BlockTagButton from "@/components/v2/block-tag-button";

export default {
  name: "Illust",
  components: {
    BlockTagButton,
    IllustCommentArea, IllustTag, UserAvatar, UserLink, IllustLink, IllustBookmarkButton, UserTitle, IllustImage, IllustCard, Loading, SuccessFilled, QuestionFilled
  },
  data() {
    return {
      activeIndex: 0,
      loading: false,
      liking: false,
      showTabs: false,
      failed: false,
      data: undefined,
      others: [],
      pid: undefined,
      original: [],
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapActions("Illust", ['detail']),
    ...mapActions("Aria2", ['addUri']),
    ...mapGetters("User", ['getUser']),
    //使用Aria2下载原图
    aria2Download: function () {
      if (this.data.pageCount === 1) {
        //单图作品
        let url = this.data.urls.original
        //如果为动图，替换链接
        if (this.data.illustType === 2) {
          url = url.replace("img-original", 'img-zip-ugoira')
              .replace('_ugoira0.jpg', '_ugoira1920x1080.zip')
        }
        //任务名称
        let name = this.pid + "_p0"
        let dir = this.config.aria2.homePath
        this.addUri({name, url, param: {dir}})

      }
    },
    like() {
      this.liking = true;
      this.$store.getters.getApi.bookmark.like(this.pid).then(res => {
        this.data.likeData = true;
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        this.liking = false;
      })
    },
    refresh() {
      this.load(this.$route)
    },
    getUrl(type, index) {
      return this.data.urls[type].replace('https://i.pximg.net', '/pximg').replace("_p0", "_p" + index)
    },
    load(route, force) {
      const {pid} = route.params
      this.pid = Number(pid)
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
        //如果有标题 修改浏览器标题
        res.title && Title.set(res.title)

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