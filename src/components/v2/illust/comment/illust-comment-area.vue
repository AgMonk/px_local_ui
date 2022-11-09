<template>
  <el-container direction="vertical" style="background-color: rgba(1,48,133,0.3)">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <div style="color: white;text-align: left;">
        <h2>评论区
          <comment-stamp :pid="pid" @success="commentSuccess" />
          <comment-text :pid="pid" @success="commentSuccess" />
          <el-switch
              v-model="show"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </h2>
        <div v-if="show">
          <!--        评论内容-->
          <div id="scrollbar"
               v-infinite-scroll="refresh"
               :infinite-scroll-disabled="loading || !hasNext"
               style="overflow:auto;max-height: 500px;min-height: 100px"
          >
            <illust-comment v-for="comment in data" :data="comment" :pid="pid" is-root style="margin-bottom: 2px" @deleted="deleted" />

            <el-divider v-if="!hasNext">到底了</el-divider>
            <div v-if="failed" style="color:white;cursor: pointer" @click="refresh">
              <h3>请求失败</h3>
              <h4>点击刷新</h4>
            </div>
            <div v-else-if="loading" v-loading="loading" style="min-height: 100px"></div>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import {mapActions} from "vuex";
import IllustComment from "@/components/v2/illust/comment/illust-comment";
import CommentStamp from "@/components/v2/illust/comment/comment-stamp";
import CommentText from "@/components/v2/illust/comment/comment-text";

export default {
  name: "illust-comment-area",
  components: {CommentText, IllustComment, CommentStamp},
  data() {
    return {
      data: [],
      page: 1,
      show: false,
      hasNext: true,
      loading: false,
      failed: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions("IllustComment", ['illustsRoots']),
    commentSuccess(res) {
      //回复成功
      this.data = [res, ...this.data];
    },
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
      this.load(to)
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
#scrollbar::-webkit-scrollbar {
  width: 6px;
}

#scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgb(127, 188, 232);
}

#scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.07);

}
</style>