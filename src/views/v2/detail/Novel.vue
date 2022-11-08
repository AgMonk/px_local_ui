<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header style="color:white">{{ $route.name }}</el-header>-->
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">

        <el-container direction="horizontal">
          <!--          header 和正文-->
          <el-main>
            <el-container direction="horizontal">
              <el-aside width="300px">
                <novel-image :info="{id:data.id,showImage:true}" @failed="" @success="" />
              </el-aside>
              <el-main style="text-align: left;padding:0 10px">
                <!--      todo   系列标题-->
                <div v-if="data.seriesNavData" style="color: rgba(255,255,255,0.5)">
                  系列: {{ data.seriesNavData.title }}
                </div>
                <!--            标题-->
                <div style="font-weight: bold;color: white;margin-top: 5px">
                  {{ data.title }}
                </div>
                <!--            描述-->
                <div class="gin-scrollbar" style="color: rgba(255,255,255,0.7);max-height: 200px;margin-top: 5px" v-html="data.description" />
                <!--            标签-->
                <div>
                  <el-tag v-for="item in data.tags"
                          :type="item.tag.toLowerCase().startsWith('r-18')?'danger':''"
                          effect="dark"
                          size="small"
                          style="margin-right: 3px;margin-bottom: 3px"
                  >
                    <copy-span :text="item.tag" />
                  </el-tag>
                </div>

                <!--            其他信息-->
                <div id="other-info">
                  <div>
                    <span>{{ data.createDate }}</span>
                    <span>喜欢:{{ data.likeCount }}</span>
                    <span>收藏:{{ data.bookmarkCount }}</span>
                    <span>浏览:{{ data.viewCount }}</span>
                  </div>
                  <div>
                    <span>字数:{{ data.characterCount }}</span>
                    <span>阅读时长:{{ Math.floor(data.readingTime / 60) }}分钟</span>
                  </div>
                </div>
              </el-main>
            </el-container>
            <el-pagination v-model:current-page="page"
                           :layout="layout"
                           :page-size="1"
                           :total="pages.length"
                           hide-on-single-page
                           size="small"
                           @current-change="changePage"
            />
            <!--              正文-->
            <div id="novel-content" class="gin-scrollbar">
              {{ content }}
            </div>

          </el-main>
          <!--          右侧边-->
          <el-aside style="padding-left: 20px;" width="250px">
            <div>
              <!--            用户头像-->
              <user-title :uid="data.uid" />
            </div>


            <div style="margin-top: 10px;text-align: left">
              <el-form v-if="seriesNavData">
                <el-form-item>
                  <template #label>
                    <span class="right-aside-label">系列</span>
                  </template>
                  <span style="color: white">
                    <!--                    todo 系列链接-->
                    {{ seriesNavData.title }}
                  </span>
                </el-form-item>
                <el-form-item v-if="seriesNavData.prev">
                  <template #label>
                    <span class="right-aside-label">前篇</span>
                  </template>
                  <novel-link :nid="seriesNavData.prev.id" disable-tooltip>
                    <span style="color: white">{{ seriesNavData.prev.order }}#{{ seriesNavData.prev.title }}</span></novel-link>
                </el-form-item>
                <el-form-item v-if="seriesNavData.next">
                  <template #label>
                    <span class="right-aside-label">后篇</span>
                  </template>
                  <novel-link :nid="seriesNavData.next.id" disable-tooltip>
                    <span style="color: white">{{ seriesNavData.next.order }}#{{ seriesNavData.next.title }}</span></novel-link>
                </el-form-item>


                <el-form-item>
                  <template #label>
                    <span style="color: white"></span>
                  </template>
                  <span style="color: white"></span>
                </el-form-item>

              </el-form>
            </div>

          </el-aside>
        </el-container>

      </retry-div>
    </el-main>
    <!--    <el-footer></el-footer>-->
  </el-container>

</template>

<script>
import {mapActions} from "vuex";
import RetryDiv from "@/components/v2/retry-div";
import {ElMessage} from "element-plus";
import {Title} from "gin-utils/dist/utils/DomUtils";
import UserTitle from "@/components/v2/user/user-title";
import NovelImage from "@/components/v2/novel/novel-image";
import CopySpan from "@/components/v2/copy/copy-span";
import NovelLink from "@/components/v2/novel/novel-link";

const name = "小说详情"

export default {
  name: "Novel",
  data() {
    return {
      params: {
        nid: Number(this.$route.params.nid),
        force: false,
      },
      layout: "prev, pager, next, jumper",
      data: undefined,
      content: undefined,
      seriesNavData: undefined,
      pages: [],
      page: 1,
    }
  },
  components: {NovelLink, CopySpan, NovelImage, UserTitle, RetryDiv},
  computed: {},
  methods: {
    ...mapActions("Novel", ['detail', 'series']),
    //成功回调
    success(res) {
      console.log(res)
      this.data = res;
      this.pages = res.content.split('[newpage]')
      this.seriesNavData = res.seriesNavData
      this.changePage(1)

      if (res.seriesNavData) {
        this.series({seriesId: res.seriesNavData.seriesId}).then(res => {
          console.log(res)
        })
      }
    },
    changePage(e) {
      this.page = e;
      this.content = this.pages[e - 1]
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    request({nid, force}) {
      return this.detail({nid, force})
    },
    load(route, force) {
      this.params = {
        nid: Number(route.params.nid),
        force,
      }
    }
  },
  mounted() {
    Title.set("小说详情")
  },
  watch: {
    $route(to) {
      if (to.name === name) {
        this.load(to)
      }
    }
  },
  props: {},
}

</script>

<style scoped>
#other-info span {
  margin-right: 5px;
  color: rgba(255, 255, 255, 0.7);
}

#novel-content {
  color: rgba(255, 255, 255, 0.7);
  white-space: pre-wrap;
  text-align: left;
  max-height: 600px;
  line-height: 30px;
}

.right-aside-label {
  color: #8d7fe8;
}
</style>