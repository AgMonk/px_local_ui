<template>
  <div style="margin-bottom: 3px">
    <user-avatar :uid="data.userId" />
    <user-link :uid="data.userId" />
    <span style="color: rgba(240,248,255,0.65)">@{{ data.commentDate }}</span>:
    <span v-if="data.comment" v-html="data.comment"></span>
    <el-image v-else :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${data.stampId}_s.jpg`" style="width: 30px" />
                                                                              <!--      楼中楼-->
    <div v-if="data.hasReplies" style="padding-left: 40px">
      <el-button v-if="children.length===0 && !loading" size="small" type="primary" @click="loadReplies">查看回复</el-button>
      <el-button v-if="children.length===0 && loading" :disabled="true" size="small" type="info">加载中..</el-button>
      <el-scrollbar v-if="children.length>0" v-infinite-scroll="loadReplies" :infinite-scroll-disabled="loading" :infinite-scroll-immediate="false" :max-height="300">
        <illust-comment v-for="comment in children" :data="comment" />
        <div v-if="!hasNext">~到底了~</div>
        <div v-if="failed" style="color:white;cursor: pointer" @click="loadReplies">
          <h3>请求失败</h3>
          <h4>点击刷新</h4>
        </div>
        <div v-else-if="loading" v-loading="loading" style="min-height: 100px"></div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import {mapActions} from "vuex";

export default {
  name: "illust-comment",
  components: {UserAvatar, UserLink},
  data() {
    return {
      loading: false,
      failed: false,
      hasNext: true,
      page: 1,
      children: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("IllustComment", ['illustsReplies']),
    loadReplies(force) {
      if (!this.hasNext) {
        return;
      }
      this.failed = false;
      this.loading = true;
      return this.illustsReplies({force, commentId: this.data.id, page: this.page}).then(res => {
        this.page++;
        console.log(res.comments)
        this.children.push(...res.comments);
        this.hasNext = res.hasNext;
      }).catch(e => {
        console.error(e)
        this.failed = true;
      }).finally(() => {
        this.loading = false;
      })
    },
    load(data, force) {
      this.page = 1;
      this.loading = false
      this.failed = false
      this.hasNext = true
      this.children = []
    }
  },
  mounted() {
    this.load(this.data)
  },
  watch: {
    data(to) {
      this.load(to)
    }
  },
  props: {
    data: {
      type: Object
    }
  },
}

</script>

<style scoped>

</style>