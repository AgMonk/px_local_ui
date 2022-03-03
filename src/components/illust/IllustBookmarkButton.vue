<template>
  <el-icon v-if="loading" :size="size">
    <alarm-clock />
  </el-icon>
  <el-icon v-else-if="bookmarked" :size="size" class="clickable" color="red">
    <star-filled />
  </el-icon>
  <el-icon v-else :size="size" class="clickable" @click="add">
    <star />
  </el-icon>
</template>

<script>
import {AlarmClock, Star, StarFilled} from '@element-plus/icons-vue';
import {mapActions, mapState} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "IllustBookmarkButton",
  components: {StarFilled, Star, AlarmClock},
  data() {
    return {
      loading: false,
      bookmarked: false,
    }
  },
  computed: {
    ...mapState("Config", [`config`]),
  },
  methods: {
    ...mapActions("Artworks", [`bookmarkAdd`]),
    update(o) {
      this.bookmarked = o && o.id;
    },
    add() {
      this.loading = true;
      this.bookmarkAdd({pid: this.pid, token: this.config.token}).then(res => {
        ElMessage.success("收藏成功")
        this.bookmarked = res
        this.loading = false;
      }).catch(reason => {
        this.loading = false;
        console.log(reason)
        const {message, status,} = reason
        const m = `${status}: ${message}`
        console.log(m)
        if (message.startsWith('timeout of')) {
          ElMessage.info("请求超时，请稍后重试")
        } else {
          ElMessage.error(m)
        }
      })
    },
  },
  mounted() {
    this.update(this.bmkData)
  },
  watch: {
    bmkData(to) {
      this.update(to)
    },
  },
  props: {
    bmkData: {},
    pid: {type: Number, required: true},
    size: {type: Number, default: 30},
  },
}

</script>

<style scoped>

</style>