<template>
  <el-container direction="vertical" style="padding: 0 20px">
    <!--  <el-container direction="horizontal">-->
    <!--    <el-header style="color:white">{{ $route.name }}</el-header>-->
    <el-main>
      <retry-div :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">

        <el-container direction="horizontal">
          <!--          header 和正文-->
          <el-main>
            <!--            header-->
            <el-container direction="horizontal">
              <el-aside width="200px">
                <el-image :src="data.cover['240mw']" />
              </el-aside>
              <el-main style="text-align: left;padding:0 10px">
                <div>
                  <!--r-18g标记-->
                  <el-tag v-if="data.r18g" effect="dark" type="danger">R-18G</el-tag>
                  <!--r-18标记-->
                  <el-tag v-else-if="data.r18" effect="dark" type="danger">R-18</el-tag>
                </div>
                <!--       系列标题-->
                <div style="color: rgba(255,255,255,0.5)">
                  <h3> {{ data.title }}</h3>
                </div>
                <!--            描述-->
                <div class="gin-scrollbar" style="white-space: pre-wrap;color: rgba(255,255,255,0.7);max-height: 200px;margin-top: 5px" v-html="data.caption" />
                <!--            标签-->
                <div style="margin-top: 10px">
                  <el-tag v-for="item in data.tags"
                          :type="item.tag.toLowerCase().startsWith('r-18')?'danger':''"
                          effect="dark"
                          size="small"
                          style="margin-right: 3px;margin-bottom: 3px"
                  >
                    <copy-span :text="item.tag" />
                  </el-tag>
                </div>

                <!--    其他信息-->
                <div>
                  <el-form inline size="small">
                    <el-form-item>
                      <template #label><span class="description-item">创建时间</span></template>
                      <span class="description-item">{{ data.createDate }}</span>
                    </el-form-item>
                    <el-form-item>
                      <template #label><span class="description-item">更新时间</span></template>
                      <span class="description-item">{{ data.updateDate }}</span>
                    </el-form-item>
                    <el-form-item>
                      <template #label><span class="description-item">最后更新</span></template>
                      <span class="description-item">{{ data.lastPublish }}</span>
                    </el-form-item>
                    <el-form-item>
                      <template #label><span class="description-item">阅读</span></template>
                      <novel-link :nid="data.firstNovelId" type="primary">第一话</novel-link>
                      &nbsp;&nbsp;
                      <novel-link :nid="data.latestNovelId" type="primary">最新一话</novel-link>
                    </el-form-item>

                    <br>
                    <el-form-item>
                      <template #label><span class="description-item">话数</span></template>
                      <span class="description-item">{{ data.total.count }}</span>
                    </el-form-item>
                    <el-form-item>
                      <template #label><span class="description-item">总字数</span></template>
                      <span class="description-item">{{ data.total.characters }}</span>
                    </el-form-item>
                    <el-form-item>
                      <template #label><span class="description-item">阅读时长</span></template>
                      <span class="description-item">{{ Math.floor(data.total.readingTime / 60) }}分钟</span>
                    </el-form-item>


                  </el-form>
                </div>
              </el-main>
            </el-container>
            <!--            正文列表-->
            <novel-series-content :series-id="Number($route.params.seriesId)" :total="data.total.count" />
          </el-main>
          <!--          右侧边-->
          <el-aside style="padding-left: 20px;" width="250px">
            <div>
              <!--            用户头像-->
              <user-title :uid="data.uid" />
            </div>

            <div>
              <router-link :to="{name:'用户小说',params:{uid:data.uid}}">
                <el-link type="primary">查看作品目录</el-link>
              </router-link>
            </div>

            <!--            TXT下载 系列信息 作品标签-->
            <div style="margin-top: 10px;text-align: left">
              <!--小说系列-->
              <el-form>
                <el-form-item>
                  <template #label>
                    <span class="right-aside-label">作品<br>标签</span>
                  </template>
                  <div class="gin-scrollbar" style="max-height: 300px">
                    <novel-tags :uid="data.uid" />
                  </div>
                </el-form-item>
              </el-form>
            </div>

          </el-aside>
        </el-container>
      </retry-div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {Title} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";
import NovelImage from "@/components/v2/novel/novel-image";
import CopySpan from "@/components/v2/copy/copy-span";
import UserTitle from "@/components/v2/user/user-title";
import NovelTags from "@/components/v2/novel/novel-tags";
import NovelLink from "@/components/v2/novel/novel-link";
import NovelSeriesContent from "@/components/v2/novel/series/novel-series-content";

const name = "小说系列"

export default {
  name: "Novel",
  data() {
    return {
      params: {
        seriesId: Number(this.$route.params.seriesId),
        force: false,
      },
      data: undefined,
    }
  },
  components: {NovelSeriesContent, NovelLink, NovelTags, UserTitle, CopySpan, NovelImage},
  computed: {},
  methods: {
    ...mapActions("Novel", ['series']),
    success(e) {
      console.log(e)
      this.data = e;
      Title.set("系列: " + e.title)
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    request({seriesId, force}) {
      return this.series({seriesId, force})
    },
    load(route, force) {
      this.params = {
        seriesId: Number(route.params.seriesId),
        force,
      }
    }
  },
  mounted() {
    Title.set(name)
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
.right-aside-label {
  color: #8d7fe8;
}

.description-item {
  color: rgba(255, 255, 255, 0.5)
}
</style>