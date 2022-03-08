<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main v-if="data">
      <el-container>
        <el-main id="预览图片">
          <el-container direction="vertical">
            <el-main>
              <div v-if="data.counts.page>1" id="预览区" style="text-align: left">
                <el-image
                    v-for="(item,i) in thumbsList"
                    :initial-index="i"
                    :preview-src-list="[item]"
                    :src="item"
                    fit="cover"
                    hide-on-click-modal
                    style="width: 80px; height: 80px"
                    @error="loadSingleThumbs"
                    @load="loadSingleThumbs"
                />
              </div>
              <div v-show="!loadingThumb" id="图片区">
                <el-image :initial-index="1"
                          :preview-src-list="original"
                          :src="config.domain+data.urls.regular"
                          hide-on-click-modal
                          @error="loadingThumb=false"
                          @load="loadingThumb=false"
                />
              </div>
              <div v-if="loadingThumb" v-loading="loadingThumb" :element-loading-spinner="svg"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   element-loading-svg-view-box="-10, -10, 50, 50"
                   element-loading-text="加载中..."
                   style="height:300px"
              >

              </div>

              <div v-if="data.tags && data.tags.length>0" id="标签区" style="text-align: left">
                <el-divider content-position="left">标签</el-divider>
                <span v-for="tag in data.tags" style="margin-left: 2px">
                  <el-tag size="small" style="padding: 0 2px;">
                    <el-icon v-if="tag.locked">
                      <lock />
                    </el-icon>
                    {{ tag.tag }}
                  </el-tag>
                  <span class="common-text">{{ tag.translation }}</span>
                </span>
              </div>
              <div id="评论区"
                   v-infinite-scroll="loadComments"
                   v-loading="comments.loading"
                   :element-loading-spinner="svg"
                   :infinite-scroll-disabled="!comments.hasNext"
                   element-loading-background="rgba(0, 0, 0, 0.8)"
                   element-loading-svg-view-box="-10, -10, 50, 50"
                   element-loading-text="加载中..."
              >
                <el-divider content-position="left">评论区</el-divider>
                <el-scrollbar height="400px">
                  <div v-for="row in comments.data" style="text-align: left">
                    <illust-comment :comment="row" />
                  </div>
                  <el-row style="color:white">
                    <el-col v-if="!comments.hasNext">没有了</el-col>
                    <el-col v-else>加载中...</el-col>
                  </el-row>
                </el-scrollbar>


              </div>

            </el-main>
          </el-container>
        </el-main>
        <el-aside id="信息">
          <div>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="操作">
                <el-button size="small" type="danger" @click="closeAllTabs">关闭全部标签</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-if="author" id="作者信息">
            <el-descriptions :column="1" border>
              <el-descriptions-item>
                <template #label>
                  <user-avatar :size="40" :uid="author.id" />
                </template>
                <user-link :size="25" :uid="author.id" />
                <user-follow-button :user="author" style="margin-left: 5px" />
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div v-else v-loading="!author" style="height:50px"></div>
          <div v-if="data" id="作品信息">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="标题" label-class-name="des-label">{{ data.title }}</el-descriptions-item>
              <el-descriptions-item label="操作" label-class-name="des-label">
                <illust-bookmark-button :bmk-data="data.bmkData" :pid="data.id" />

              </el-descriptions-item>
              <el-descriptions-item label="pid" label-class-name="des-label">
                <my-copy-button :text="data.id">{{ data.id }}</my-copy-button>
                <my-copy-button :text="`https://www.pixiv.net/artworks/${data.id}`">地址</my-copy-button>
              </el-descriptions-item>
              <el-descriptions-item v-if="data.timestamp" label="创建时间" label-class-name="des-label">{{ data.timestamp.create }}</el-descriptions-item>
              <el-descriptions-item v-if="data.timestamp&& data.timestamp.create!==data.timestamp.upload" label="上传时间" label-class-name="des-label">{{
                  data.timestamp.upload
                                                                                                                                                    }}
              </el-descriptions-item>
              <el-descriptions-item label="尺寸" label-class-name="des-label">{{ data.width }}x{{ data.height }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="喜欢" label-class-name="des-label">{{ data.counts.like }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="浏览" label-class-name="des-label">{{ data.counts.view }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="收藏" label-class-name="des-label">{{ data.counts.bookmark }}
              </el-descriptions-item>
              <el-descriptions-item v-if="data.counts && data.counts.page>1" label="图片数" label-class-name="des-label">{{ data.counts.page }}</el-descriptions-item>
              <el-descriptions-item label="下载" label-class-name="des-label">
                <el-button type="primary" @click="downloadIllust({data,dir:config.aria2.dir})">Aria2下载所有</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="描述" label-class-name="des-label">
                {{ data.description }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div id="描述区">

          </div>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";
import MyCopyButton from "@/components/common/my-copy-button";
import {Lock} from '@element-plus/icons-vue';
import {getRootComment} from "@/assets/js/request/comment";
import IllustComment from "@/components/illust/IllustComment";
import UserAvatar from "@/components/user/UserAvatar";
import UserLink from "@/components/user/UserLink";
import UserFollowButton from "@/components/user/UserFollowButton";
import IllustBookmarkButton from "@/components/illust/IllustBookmarkButton";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "ArtworkDetail",
  components: {IllustBookmarkButton, UserFollowButton, UserLink, UserAvatar, IllustComment, MyCopyButton, Lock},
  data() {
    return {
      data: undefined,
      thumbs: [],
      thumbsList: [],
      original: [],
      comments: {
        loading: false,
        offset: 0,
        data: [],
        hasNext: true,
      },
      author: undefined,
      loadingThumb: true,
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
    ...mapState("Loading", [`svg`]),
  },
  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),
    ...mapActions("User", [`getUserInfo`]),
    ...mapActions("Aria2", [`downloadIllust`]),
    ...mapMutations("User", [`saveInfo2Cache`]),
    ...mapMutations("Artworks", [`delAllTabs`]),
    closeAllTabs() {
      ElMessageBox.confirm('确认关闭所有标签？').then(() => {
        this.delAllTabs()
        const path = this.$route.query.from
        if (path) {
          this.$router.push(path)
        }
      }).catch(reason => {
        console.log(reason)
        ElMessage.info("已取消")
      })
    },
    loadSingleThumbs() {
      let i = this.thumbsList.length;
      if (i < this.thumbs.length) {
        this.thumbsList.push(this.thumbs[i])
      }
    },
    loadAuthorInfo(uid) {
      this.getUserInfo({uid}).then(res => {
        this.author = res;
      }).catch(reason => autoRetry(reason, () => this.loadAuthorInfo(uid)))
    },
    load(route) {
      const pid = Number(route.params.pid)
      this.author = undefined;
      this.loadingThumb = true;
      this.comments = {
        loading: false,
        offset: 0,
        data: [],
        hasNext: true,
      }
      this.getIllustInfo({pid}).then(res => {
        console.log(res)
        this.data = res

        this.thumbs = [];
        this.thumbsList = [];
        this.original = [];
        const domain = this.config.domain;
        for (let i = 0; i < res.counts.page; i++) {
          this.thumbs.push(domain + res.urls.small.replace("_p0", `_p${i}`))
          this.original.push(domain + res.urls.original.replace("_p0", `_p${i}`))
        }
        this.loadSingleThumbs()
        this.loadAuthorInfo(res.authorId)

      }).catch(reason => {
        console.log(reason)
        const {message, status,} = reason
        ElMessage.error(`${status}: ${message}`)
      })
    },
    loadComments() {
      if (this.comments.loading) {
        return
      }
      this.comments.loading = true
      getRootComment({pid: this.data.id, offset: this.comments.offset}).then(res => {
        const {comments, hasNext} = res
        this.comments.hasNext = hasNext
        this.comments.data.push(...comments)
        this.comments.offset += 50;
        this.comments.loading = false
        console.log(this.comments)

        for (let i = 0; i < comments.length; i++) {
          this.saveInfo2Cache(comments[i].author)
        }
      }).catch(reason => {
        console.log(reason)
        this.comments.loading = false
      })
    },
  },
  mounted() {
    this.load(this.$route)
    console.log(this.$route)
  },
  watch: {
    $route(to) {
      if (to.name === '作品详情') {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>