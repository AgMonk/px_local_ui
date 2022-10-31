<template>
  <div style="color: white;text-align: left;background-color: rgba(1,48,133,0.3)">
    <h2>评论区</h2>
    <!--todo 回复作者-->
    <div>
      <!--        评论内容-->
      <el-scrollbar v-infinite-scroll="refresh" :infinite-scroll-disabled="loading" height="300px">
        <illust-comment v-for="comment in data" :data="comment" :pid="pid" style="margin-bottom: 2px" @deleted="deleted" />

        <div v-if="!hasNext" style="text-align: center">到底了</div>
        <div v-if="failed" style="color:white;cursor: pointer" @click="refresh">
          <h3>请求失败</h3>
          <h4>点击刷新</h4>
        </div>
        <div v-else-if="loading" v-loading="loading" style="min-height: 100px"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import IllustComment from "@/components/v2/illust/comment/illust-comment";

export default {
  name: "illust-comment-area",
  components: {IllustComment},
  data() {
    return {
      data: [],
      page: 1,
      hasNext: true,
      loading: false,
      failed: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions("IllustComment", ['illustsRoots']),
    //删除回复回调
    deleted(commentId) {
      this.data = this.data.filter(i => i.id !== commentId)
    },
    refresh() {
      this.roots(this.pid)
    },
    load(pid, force) {
      this.page = 1;
      this.hasNext = true;
      this.data = [];
      this.roots(pid, force)
    },
    roots(pid, force) {
      if (!this.hasNext) {
        return;
      }
      this.failed = false;
      this.loading = true;
      return this.illustsRoots({force, pid, page: this.page}).then(res => {
        this.page++;
        console.log(res.comments)
        this.data.push(...res.comments);
        this.hasNext = res.hasNext;
      }).catch(e => {
        console.error(e)
        this.failed = true;
      }).finally(() => {
        this.loading = false;
      })
    }
  },
  mounted() {
    // this.load(this.pid)
  },
  watch: {
    pid(to) {

    }
  },
  props: {
    pid: {
      type: Number,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>