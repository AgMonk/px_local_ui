<template>
  <div :style="{
    display: 'inline-block',
    width: `${size}px`,
  }"
  >
    <div>
      <illust-image :info="info" :size="size" @failed="failed" @success="success" />
    </div>

    <div class="single-line" style="height: 20px;text-align: left">
      <!--标题-->
      <illust-link :pid="info.id" :title="data.title">
        <span style="color: #42b983">
          {{ data.title }}
        </span>
      </illust-link>
    </div>
    <div class="single-line" style="height: 20px;text-align: left">
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
import {mapGetters, mapState} from "vuex";
import IllustLink from "@/components/v2/illust/illust-link";
import UserLink from "@/components/v2/user/user-link";
import UserAvatar from "@/components/v2/user/user-avatar";
import IllustImage from "@/components/v2/illust/illust-image";

export default {
  name: "illust-card",
  components: {IllustImage, UserAvatar, UserLink, IllustLink},
  data() {
    return {
      loading: true,
      data: {},
    }
  },
  emits: ['failed', 'success'],
  computed: {
    ...mapState("Config", ['config']),
  },
  methods: {
    ...mapGetters("Illust", ['getIllust']),
    failed() {
      this.$emit("failed", this.data.id)
    },
    success() {
      this.loading = false;
      this.$emit("success", this.data.id)
    },
    load(info) {
      this.loading = true;
      this.data = this.getIllust()(info.id)
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
    size: {
      type: Number,
      default: 150,
    },
  },
  beforeUnmount() {
    this.startUnmounted = new Date().getTime()
    console.debug(`beforeUnmount`, this.info.id)
  },
  unmounted() {
    let duration = new Date().getTime() - this.startUnmounted;
    console.debug(`unmount cost: ${duration}ms`, this.info.id)
  },
}

</script>

<style scoped>
.single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


</style>