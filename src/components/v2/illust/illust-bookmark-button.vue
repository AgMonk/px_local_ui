<template>
  <el-icon v-if="loading" :size="size" class="is-loading" color="white">
    <Loading />
  </el-icon>
  <el-icon v-else-if="data" :size="size" class="bmk-button" color="red" @click="del">
    <StarFilled />
  </el-icon>
  <el-icon v-else :color="emptyColor" :size="size" class="bmk-button" @click="add">
    <Star />
  </el-icon>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {Loading, Star, StarFilled} from "@element-plus/icons-vue"
import {ElMessage} from "element-plus";

export default {
  name: "illust-bookmark-button",
  components: {Star, StarFilled, Loading},
  data() {
    return {
      loading: false,
      data: {},
    }
  },
  computed: {},
  methods: {
    ...mapActions("Illust", ["addBookmark", "delBookmark", "bookmarkData"]),
    ...mapGetters("Illust", ['getBookmarkData']),
    load() {
      this.data = this.getBookmarkData()(this.pid)
    },
    add() {
      console.debug("添加收藏:" + this.pid)
      this.loading = true;
      this.addBookmark(this.pid).then(() => {
        ElMessage.success("收藏成功")
        this.loading = false;
        this.load();
      }).catch(() => {
        //请求失败或超时，请求检查结果
        this.bookmarkData(this.pid).then(res => {
          if (res) {
            ElMessage.success("收藏成功")
          } else {
            ElMessage.error("收藏失败，请重试")
          }
        }).finally(() => {
          this.load();
          this.loading = false;
        })
      })
    },
    del() {
      console.debug("移除收藏:" + this.pid)
      this.loading = true;
      this.delBookmark({pid: this.pid, bmkId: this.data.id}).then(() => {
        ElMessage.success("取消收藏成功")
        this.loading = false;
        this.load();
      }).catch(() => {
        //请求失败或超时，请求检查结果
        this.bookmarkData(this.pid).then(res => {
          if (!res) {
            ElMessage.success("取消收藏成功")
          } else {
            ElMessage.error("取消收藏失败，请重试")
          }
        }).finally(() => {
          this.load();
          this.loading = false;
        })
      })
    },
  },
  mounted() {
    this.load()
  },
  watch: {
    pid(to) {
      this.load()
    }
  },
  props: {
    pid: {},
    size: {
      default: 30
    },
    emptyColor: {
      default: "white"
    },

  },
}

</script>

<style scoped>
.bmk-button {
  cursor: pointer;
}

</style>