<template>
  <div
      :style="{
        width: `${size}px`,
  }" class="novel-card"
  >
    <div>
      <!--    封面图-->
      <novel-image :info="info" @failed="failed" @success="success" />
    </div>


    <div v-if="info.uid" class="single-line" style="height: 20px;text-align: left">
      <el-row>
        <!--   作者头像-->
        <el-col :span="4">
          <user-avatar :uid="info.uid" />
        </el-col>
        <!--作者-->
        <el-col :span="20">
          <user-link :uid="info.uid" />
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import NovelImage from "@/components/v2/novel/novel-image";

const name = ""

export default {
  name: "novel-card",
  components: {NovelImage, UserAvatar, UserLink},
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
  display: inline-block;
}

.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>