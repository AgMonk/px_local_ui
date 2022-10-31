<template>
  <div style="margin-bottom: 3px">
    <!--    用户和日期信息-->
    <div>
      <user-avatar :uid="data.userId" />
      <user-link :uid="data.userId" />
      <span style="color: rgba(240,248,255,0.65)"> @ {{ data.commentDate }}</span>
      <span v-if="data.replyToUserId">
        回复
        <user-link :uid="data.replyToUserId" />
      </span>
      :
      <!--删除-->
      <comment-del v-if="data.editable" :comment-id="data.id" :pid="pid" style="margin-right: 5px" @deleted="$emit('deleted',data.id)" />
      <!--表情贴图回复-->
      <comment-stamp :parent-id="data.id" :pid="pid" :reply-to-user-id="data.userId" style="margin-right: 5px" @success="commentSuccess" />
      <comment-text :parent-id="data.id" :pid="pid" :reply-to-user-id="data.userId" style="margin-right: 5px" @success="commentSuccess" />
    </div>

    <!--    回复正文-->
    <div style="padding-left: 40px">
      <span v-if="data.comment" v-html="data.comment"></span>
      <el-image v-else :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${data.stampId}_s.jpg`" style="width: 50px" />
    </div>


    <!--楼中楼-->
    <div v-if="data.hasReplies" style="padding-left: 40px">
      <el-button v-if="children.length===0 && !loading" size="small" type="primary" @click="loadReplies">查看回复</el-button>
      <el-button v-if="children.length===0 && loading" :disabled="true" size="small" type="info">加载中..</el-button>
      <el-scrollbar v-if="children.length>0" v-infinite-scroll="loadReplies" :infinite-scroll-disabled="loading" :infinite-scroll-immediate="false" :max-height="300">
        <illust-comment v-for="comment in children" :data="comment" :pid="pid" @deleted="deleted" @comment-success="commentSuccess" />
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
import {ElMessage} from "element-plus";
import CommentStamp from "@/components/v2/illust/comment/comment-stamp";
import CommentDel from "@/components/v2/illust/comment/comment-del";
import CommentText from "@/components/v2/illust/comment/comment-text";

export default {
  name: "illust-comment",
  components: {CommentText, CommentDel, CommentStamp, UserAvatar, UserLink},
  emits: ['deleted', "comment-success"],
  data() {
    return {
      loading: false,
      deleting: false,
      failed: false,
      hasNext: true,
      page: 1,
      children: [],
    }
  },
  computed: {},
  methods: {
    ...mapActions("IllustComment", ['illustsReplies', 'delComment']),
    //回复成功回调
    commentSuccess(res) {
      console.log(res)
      //如果当前回复为根回复，在本级处理
      if (this.isRoot) {
        this.data.hasReplies = true
        if (this.children.length === 0) {
          //如果还未请求楼中楼，执行请求
          this.hasNext = true
          this.loadReplies()
        } else {
          //如果已经有楼中楼，添加到最前
          this.children = [res, ...this.children]
        }
      } else {
        //当前回复不是根回复，抛出到上一级处理
        this.$emit("comment-success", res)
      }
    },
    //楼中楼 删除回复回调
    deleted(commentId) {
      this.children = this.children.filter(i => i.id !== commentId)
      if (this.children.length === 0) {
        this.data.hasReplies = false
        this.page = 1;
      }
    },
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
        ElMessage.error("加载失败,请重试")
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
    },
    pid: {
      type: Number,
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    }
  },
}

</script>

<style scoped>

</style>