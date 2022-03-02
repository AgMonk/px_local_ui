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
              <div id="图片区">
                <el-image :initial-index="1" :preview-src-list="original" :src="config.domain+data.urls.regular" hide-on-click-modal />
              </div>

              <div v-if="data.tags && data.tags.length>0" id="标签区" style="text-align: left">
                <el-divider content-position="left">标签</el-divider>
                <span v-for="tag in data.tags">
                  <el-tag size="small" style="padding: 0 2px;">
                    <el-icon v-if="tag.locked">
                      <lock />
                    </el-icon>
                    {{ tag.tag }}
                  </el-tag>
                  <span style="color:hsla(0,0%,100%,.39)">{{ tag.translation }}</span>
                </span>
              </div>
              <!--              v-infinite-scroll="loadComments" -->
              <!--              infinite-scroll-disabled="!comments.hasNext"-->
              <div id="评论区" v-loading="comments.loading">
                <el-divider content-position="left">评论区</el-divider>
                <!--                todo-->

                <el-row style="color:white">
                  <el-col v-if="!comments.hasNext">没有了</el-col>
                  <el-col v-else>加载中...</el-col>
                </el-row>
              </div>

            </el-main>
          </el-container>
        </el-main>
        <el-aside id="信息">
          <div id="作者信息">

          </div>
          <div id="作品信息">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="标题">{{ data.title }}</el-descriptions-item>
              <el-descriptions-item label="pid">
                <my-copy-button :text="data.id">{{ data.id }}</my-copy-button>
                <my-copy-button :text="`https://www.pixiv.net/artworks/${data.id}`">地址</my-copy-button>
              </el-descriptions-item>
              <el-descriptions-item v-if="data.timestamp" label="创建时间">{{ data.timestamp.create }}</el-descriptions-item>
              <el-descriptions-item v-if="data.timestamp&& data.timestamp.create!==data.timestamp.upload" label="上传时间">{{ data.timestamp.upload }}</el-descriptions-item>
              <el-descriptions-item label="尺寸">{{ data.width }}x{{ data.height }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="喜欢">{{ data.counts.like }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="浏览">{{ data.counts.view }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts" label="收藏">{{ data.counts.bookmark }}</el-descriptions-item>
              <el-descriptions-item v-if="data.counts && data.counts.page>1" label="图片数">{{ data.counts.page }}</el-descriptions-item>
              <el-descriptions-item label="下载">
                <el-button type="primary" @click="downloadAll">Aria2下载所有</el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div id="描述区">
            {{ data.description }}
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {ElMessage} from "element-plus";
import MyCopyButton from "@/components/common/my-copy-button";
import {Lock} from '@element-plus/icons-vue';
import {getRootComment} from "@/assets/js/request/comment";

export default {
  name: "ArtworkDetail",
  components: {MyCopyButton, Lock},
  data() {
    return {
      data: undefined,
      thumbs: [],
      thumbsList: [],
      original: [],
      comments: {
        loading:false,
        offset: 0,
        data: [],
        hasNext: true,
      },
    }
  },
  computed: {
    ...mapState("Config", [`config`])
  },
  methods: {
    ...mapActions("Artworks", [`getIllustInfo`]),
    ...mapActions("Aria2", [`addQuery`, `addFirst`]),
    downloadAll() {
      const url = this.data.type === 2 ? this.data.urls.zip : this.data.urls.original
      const count = this.data.counts.page
      this.addQuery({url, count}).then(() => {
        ElMessage.success(`已添加 ${count} 个任务到队列`)
        this.addFirst()
      })
    },
    loadSingleThumbs() {
      let i = this.thumbsList.length;
      if (i < this.thumbs.length) {
        this.thumbsList.push(this.thumbs[i])
      }
    },
    load(route) {
      const pid = Number(route.params.pid)
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
        this.loadComments()
      }).catch(reason => {
        console.log(reason)
        const {message, status,} = reason
        ElMessage.error(`${status}: ${message}`)
      })
    },
    loadComments() {
      this.comments.loading=true
      getRootComment({pid: this.data.id, offset: this.comments.offset}).then(res => {
        const {comments, hasNext} = res
        this.comments.hasNext = hasNext
        this.comments.data.push(...comments)
        this.comments.offset+=50;
        this.comments.loading=false
        console.log(this.comments)
      }).catch(reason=>{
        console.log(reason)
        this.comments.loading=false
      })
    },
  },
  mounted() {
    this.load(this.$route)
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