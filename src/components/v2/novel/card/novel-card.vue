<template>
  <el-container v-if="info" class="novel-card" direction="horizontal" style="display: inline-block;vertical-align: top">
    <div style="display: flex;width: 400px">
      <el-aside width="150px">
        <!--    封面图-->
        <novel-link :nid="info.id">
          <novel-image :info="info" @failed="failed" @success="success" />
        </novel-link>
      </el-aside>
      <el-main v-if="data" style="margin-left: 5px;">
        <!--      todo   系列标题-->
        <div v-if="data.seriesId" style="color: rgba(255,255,255,0.5)">
          系列: {{ data.seriesTitle }}
        </div>
        <!--     标题-->
        <div class="single-line">
          <novel-link :nid="info.id"><span style="color: white">{{ data.title }}</span></novel-link>
        </div>
        <!--      作者-->
        <div class="single-line">
          <el-row v-if="info.hasOwnProperty('uid')">
            <!--   作者头像-->
            <el-col :span="2">
              <user-avatar :uid="info.uid" />
            </el-col>
            <!--作者-->
            <el-col :span="22" style="text-align: left;">
              <user-link :uid="info.uid" />
            </el-col>
          </el-row>
        </div>
        <!--  标签-->
        <div class="gin-scrollbar" style="max-height: 69px;">
          <el-tag v-for="item in data.tagList"
                  :type="item.toLowerCase().startsWith('r-18')?'danger':''"
                  effect="dark"
                  size="small"
                  style="margin-right: 3px;margin-bottom: 3px"
          >
            <!--   todo       标签跳转-->
            <copy-span :text="item" />
          </el-tag>
        </div>
        <!--   描述-->
        <div class="gin-scrollbar" style="color: white;text-align: left;max-height: 80px" v-html="data.description.replaceAll('<br />','')">
        </div>
        <!--     字数 阅读时间 喜欢数量-->
        <div style="margin-top: 10px;color: rgba(255,255,255,0.5)">
          <!--          字数-->
          <span style="margin-right: 5px">{{ data.textCount }}字</span>
          <!--          阅读时长-->
          <span style="margin-right: 5px">{{ Math.floor(data.readingTime / 60) }}分钟</span>
          <!--          喜欢数量-->
          <span>★{{ data.bookmarkCount }}</span>
        </div>
      </el-main>
    </div>

  </el-container>

</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import NovelImage from "@/components/v2/novel/novel-image";
import NovelLink from "@/components/v2/novel/novel-link";
import {mapGetters} from "vuex";
import CopySpan from "@/components/v2/copy/copy-span";

const name = ""

export default {
  name: "novel-card",
  components: {CopySpan, NovelLink, NovelImage, UserAvatar, UserLink},
  data() {
    return {data: undefined}
  },
  computed: {},
  methods: {
    ...mapGetters("Novel", ['getNovel']),
    failed() {
      this.$emit("failed", this.info.id)
    },
    success() {
      this.loading = false;
      this.$emit("success", this.info.id)
    },
    load(info) {
      this.data = this.getNovel()(info.id);
    }
  },
  mounted() {
    this.load(this.info)
  },
  watch: {
    info(to) {
      this.load(to)
    }
  },
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
}

</script>

<style scoped>
.novel-card {
  color: white;
  margin-right: 5px
}

.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  /*white-space: nowrap;*/
  text-align: left;
}

</style>