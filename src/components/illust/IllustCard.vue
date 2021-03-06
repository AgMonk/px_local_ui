<template>
  <div v-if="illust" style="display:inline-block;width:150px;margin:2px 5px 3px 5px">
    <el-row>
      <el-col :span="24">
        <illust-link :pid="illust.id" disabledTooltip type="success">
          <div style="display:inline-block;width:150px;height:150px">
            <el-image :lazy="config.search.lazy"
                      :size="150"
                      :src="domain+illust.urls.thumb"
                      style="border-radius:15px"
                      @error="imageLoadError"
                      @load="avatarLoad"
            />
          </div>
        </illust-link>
        <!--        r-18标记-->
        <el-tag v-if="loadCompleted&&isR_18" effect="dark" style="position: absolute; top: 0; left: 0;padding: 0 2px;" type="danger">R-18</el-tag>
        <el-tag v-if="loadCompleted&&isR_18G" effect="dark" size="large" style="position: absolute; top: 0; left: 0;padding: 0 2px;" type="danger">R-18G</el-tag>
        <el-tag v-if="loadCompleted&&isGif" effect="dark" style="position: absolute; top: 63px; left: 55px;">GIF</el-tag>
        <!--        收藏按钮-->
        <span v-if="loadCompleted" class="b1" style="position: absolute; top: 120px ; right: 0;border-radius:15px">
          <illust-bookmark-button :bmk-data="illust.bmkData" :pid="illust.id" clock-color="white" star-color="white" />
        </span>
        <!--        图片数量-->
        <el-tag v-if="loadCompleted&&page>1" effect="dark" style="color:white;position: absolute; top: 0; right: 0;border-radius:10px;padding: 0 2px;">
          <el-icon>
            <document-copy />
          </el-icon>
          {{ page }}
        </el-tag>
        <span v-if="loadCompleted&&bookmark" class="b1" style="color:white;position: absolute; top: 120px; left: 0;border-radius:10px">
          <el-tag effect="dark" style="padding: 0 2px;" type="danger">{{ bookmark }}</el-tag>
        </span>

      </el-col>
    </el-row>
    <el-row>
      <div class="common-text single-line">
        <illust-link :pid="illust.id" type="success">{{ illust.title }}</illust-link>
      </div>
    </el-row>
    <el-row v-if="!disableUserAvatar">
      <el-col :span="4">
        <user-avatar :size="25" :uid="illust.authorId" />
      </el-col>
      <el-col :span="20" class="single-line">
        <user-link :uid="illust.authorId" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import UserAvatar from "@/components/user/UserAvatar";
import UserLink from "@/components/user/UserLink";
import IllustBookmarkButton from "@/components/illust/IllustBookmarkButton";
import IllustLink from "@/components/illust/IllustLink";
import {DocumentCopy} from "@element-plus/icons-vue";
import {autoRetry} from "@/assets/js/utils/RequestUtils";

export default {
  name: "IllustCard",
  components: {IllustLink, IllustBookmarkButton, UserLink, UserAvatar, DocumentCopy},
  data() {
    return {
      illust: undefined,
      isR_18: false,
      isR_18G: false,
      bookmark: undefined,
      page: undefined,
      loadCompleted: false,
      isGif: false,
      domain: undefined,
    }
  },
  emits: ['image-load'],
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapGetters("Artworks", [`getIllustFromCache`]),
    ...mapActions("Artworks", [`getIllustInfo`]),
    imageLoadError(e) {
      console.log("图片加载失败自动切换图片服务器重试", e)
      this.domain = this.domain === "/pximg" ? "/pxre" : "/pximg";
    },
    avatarLoad() {
      this.loadCompleted = true;
      if (this.config.detail) {
        this.getDetail();
      } else {
        this.$emit("image-load", this.illust.id)
      }
    },
    getDetail() {
      this.getIllustInfo({pid: this.pid}).then(() => {
        this.load(this.pid)
        this.$emit("image-load", this.illust.id)
      }).catch(reason => autoRetry(reason, () => this.getDetail()))
    },
    bmk() {
      const b = this.illust.counts.bookmark
      if (b) {
        if (b > 1000) {
          this.bookmark = Math.floor(b / 100) / 10 + 'k'
        } else {
          this.bookmark = b;
        }
      }
    },
    load(pid) {
      this.domain = this.config.domain
      this.illust = this.getIllustFromCache()(pid)
      const {tags, counts, type} = this.illust
      const tagList = tags.map(i => i.tag);
      this.isR_18 = tagList.includes("R-18") || tagList.includes("r-18")
      this.isR_18G = tagList.includes("R-18G") || tagList.includes("r-18g")
      this.isGif = type === 2
      this.page = counts.page;
      this.bmk()
    }
  },
  mounted() {
    this.loadCompleted = false
    this.load(this.pid)
  },
  watch: {
    pid(to) {
      this.load(to)
    }
  },
  props: {
    pid: {type: Number, required: true},
    disableUserAvatar: {type: Boolean, default: false},
  },
}

</script>

<style scoped>
.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.b1 {
  background-color: rgba(61, 24, 24, 0.34);
}
</style>