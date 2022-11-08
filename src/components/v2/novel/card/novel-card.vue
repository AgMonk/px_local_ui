<template>
  <el-container v-if="info" class="novel-card" direction="horizontal" style="display: inline-block">
    <div style="display: flex;width: 300px">
      <el-aside width="120px">
        <!--    封面图-->
        <novel-link :nid="info.id">
          <novel-image :info="info" @failed="failed" @success="success" />
        </novel-link>
      </el-aside>
      <el-main style="margin-left: 5px">
        <!--  todo    标题-->
        <div class="single-line"></div>
        <!--      作者-->
        <div class="single-line">
          <el-row v-if="info.hasOwnProperty('uid')">
            <!--   作者头像-->
            <el-col :span="4">
              <user-avatar :uid="info.uid" />
            </el-col>
            <!--作者-->
            <el-col :span="20" style="text-align: left;">
              <user-link :uid="info.uid" />
            </el-col>
          </el-row>
        </div>
        <div class="single-line">
          <el-row v-if="info.hasOwnProperty('uid')">
            <!--   作者头像-->
            <el-col :span="4">
              <user-avatar :uid="info.uid" />
            </el-col>
            <!--作者-->
            <el-col :span="20" style="text-align: left;">
              <user-link :uid="info.uid" />
            </el-col>
          </el-row>
        </div>

        <!--  todo    标签-->
        <!--  todo    描述-->
        <!--  todo    字数 阅读时间 喜欢数量-->
      </el-main>
    </div>

  </el-container>

</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import NovelImage from "@/components/v2/novel/novel-image";
import NovelLink from "@/components/v2/novel/novel-link";

const name = ""

export default {
  name: "novel-card",
  components: {NovelLink, NovelImage, UserAvatar, UserLink},
  data() {
    return {}
  },
  computed: {},
  methods: {
    failed() {
      this.$emit("failed", this.info.id)
    },
    success() {
      this.loading = false;
      this.$emit("success", this.info.id)
    },
    load(route, force) {

    }
  },
  mounted() {
  },
  watch: {},
  props: {
    info: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 150,
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
  white-space: nowrap;
  text-align: left;
}
</style>