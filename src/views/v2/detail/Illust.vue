<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header>{{ pid }}</el-header>-->
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
        <!--        主界面和右侧边-->
        <el-container direction="horizontal">
          <!--          主界面-->
          <el-main style="background-color: rgba(1,48,133,0.3);">
            <el-tabs v-if="showTabs" v-model="activeIndex" stretch tab-position="left">
              <el-tab-pane v-for="index in data.pageCount" :name="index-1" lazy>
                <template #label>
                  <el-image :src="images.small[index-1]" lazy style="height:40px;">
                    <template #placeholder>
                      <span style="color: white" v-text="index-1"></span>
                    </template>
                  </el-image>
                </template>
                <el-image :initial-index="index-1"
                          :preview-src-list="images.original"
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
              <el-descriptions-item label="下载原图">
                <el-button size="small" type="success" @click="aria2Download">Aria2</el-button>
                <copy-el-button :text="images.download.join('\n')" size="small" type="primary">复制地址</copy-el-button>
              </el-descriptions-item>

            </el-descriptions>
          </el-aside>

        </el-container>
        <!--        底部信息-->
        <div>
          <!--       标题和描述 -->
          <div style="color: white;text-align: left">
            <illust-link :pid="data.id">
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
          <div v-if="data.commentCount>0" style="margin-top: 20px">
            <comment-area :id="data.id" :author-user-id="data.userId" worksType="illusts" />
          </div>
          <!--           推荐作品-->
          <div v-if="data" style="margin-top: 20px">
            <illust-recommend :pid="data.id" />
          </div>
        </div>
      </retry-div>

      <el-dialog v-model="dialog.aria2" append-to-body title="批量下载">
        <el-button size="small" type="primary" @click="selectAll">全选</el-button>
        <el-button size="small" type="danger" @click="images.selected=[]">全不选</el-button>
        <copy-el-button :text="images.selected.join('\n')" size="small" type="primary">复制地址</copy-el-button>
        <el-button size="small" type="success" @click="aria2MultiDownload">确认下载</el-button>
        <el-scrollbar max-height="400px" style="margin-top: 10px">
          <el-checkbox-group v-model="images.selected" size="small">
            <el-tooltip v-for="index in data.pageCount">
              <template #content>
                <el-image :src="images.small[index-1]" lazy style="height:200px;" />
              </template>
              <el-checkbox :label="images.download[index-1]" border>
                {{ index - 1 }}
              </el-checkbox>
            </el-tooltip>
          </el-checkbox-group>

        </el-scrollbar>
      </el-dialog>
    </el-main>
    <!--    <el-footer></el-footer>-->
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
import BlockTagButton from "@/components/v2/block-tag-button";
import {ObjectUtils} from "gin-utils/dist/utils/ObjectUtils";
import CopyElButton from "@/components/v2/copy/copy-el-button";
import {ElMessage} from "element-plus";
import RetryDiv from "@/components/v2/retry-div";
import IllustRecommend from "@/components/v2/illust/illust-recommend";
import CommentArea from "@/components/v2/comment/comment-area";

export default {
  name: "Illust",
  components: {
    CommentArea,
    IllustRecommend,
    RetryDiv,
    CopyElButton,
    BlockTagButton,
    IllustTag,
    UserAvatar,
    UserLink,
    IllustLink,
    IllustBookmarkButton,
    UserTitle,
    IllustImage,
    IllustCard,
    Loading,
    SuccessFilled,
    QuestionFilled
  },
  data() {
    return {
      dialog: {
        aria2: false,
      },
      params: {
        pid: Number(this.$route.params.pid),
        force: false,
      },
      //图片地址
      images: {
        //选中的
        selected: [],
        //缩略图
        small: [],
        //原图(显示用)
        original: [],
        //下载备选项
        download: [],
      },
      activeIndex: 0,
      liking: false,
      showTabs: false,
      //当前作品数据
      data: undefined,
      //其他作品
      others: [],
    }
  },
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapActions("Illust", ['detail']),
    ...mapActions("Aria2", ['addUri', 'addUris']),
    ...mapGetters("User", ['getUser']),
    //刷新请求
    refresh() {
      this.load(this.$route, true)
    },
    //请求
    request(params) {
      return this.detail(params)
    },
    //成功回调
    success(res) {
      this.showTabs = false;
      this.data = res;
      this.activeIndex = 0;
      this.others = res.otherIllustIds.map(id => {
        return {id, showImage: true}
      })

      this.images.small = []
      this.images.original = []
      this.images.download = []
      for (let i = 0; i < this.data.pageCount; i++) {
        this.images.small.push(this.getUrl("small", i))
        this.images.original.push(this.getUrl("original", i))
        this.images.download.push(this.data.urls.original.replace("_p0", "_p" + i))
      }
      //如果有标题 修改浏览器标题
      res.title && Title.set(res.title)

      //等渲染完成了再加载tabs 避免从图片多的作品切换到少的作品时无畏的404请求
      this.$nextTick(() => {
        this.showTabs = true;
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    //加载方法
    load(route, force) {
      this.params = {pid: Number(route.params.pid), force}
    },
    change(e) {
      console.log(e)
    },
    //使用Aria2批量下载原图
    aria2MultiDownload() {
      console.log(this.images.selected)
      let dir = this.config.aria2.homePath
      this.addUris({
        urls: this.images.selected, dir
      }).then(() => {
        this.dialog.aria2 = false;
      })
    },
    //选中全部
    selectAll() {
      this.images.selected = ObjectUtils.clone(this.images.download);
    },
    //使用Aria2下载原图
    aria2Download() {
      if (this.data.pageCount === 1) {
        //单图作品
        let url = this.data.urls.original
        //如果为动图，替换链接
        if (this.data.illustType === 2) {
          url = url.replace("img-original", 'img-zip-ugoira')
              .replace('_ugoira0.jpg', '_ugoira1920x1080.zip')
        }
        //任务名称
        let dir = this.config.aria2.homePath
        this.addUri({url, dir})

      } else {
        //批量下载
        this.selectAll()
        this.dialog.aria2 = true;
      }
    },
    like() {
      this.liking = true;
      this.$store.getters.getApi.illustApi.like(this.params.pid).then(res => {
        this.data.likeData = true;
      }).catch(e => {
        console.error(e)
      }).finally(() => {
        this.liking = false;
      })
    },
    getUrl(type, index) {
      return this.data.urls[type].replace('https://i.pximg.net', '/pximg').replace("_p0", "_p" + index)
    },
  },
  mounted() {
    Title.set("作品详情")
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