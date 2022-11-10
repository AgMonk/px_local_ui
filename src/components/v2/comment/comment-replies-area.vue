<template>
  <div>
    <div>
      查看回复
      <el-switch
          v-model="show"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
    </div>
    <load-more-div v-if="show" :has-next="hasNext" :init-request="request" :load-more-request="request" :params="params" @success="success">
      <!--        评论显示-->
      <comment-reply v-for="item in data" :author-user-id="authorUserId" :data="item" :parent-id="commentId" :work-id="workId" :works-type="worksType" />
    </load-more-div>
  </div>
</template>

<script>
import LoadMoreDiv from "@/components/v2/load-more-div";
import {mapActions} from "vuex";

const name = "评论楼中楼"

export default {
  name: "comment-replies-area",
  data() {
    return {
      params: {
        worksType: this.worksType,
        commentId: this.commentId,
        page: 1,
        force: false,
      },
      hasNext: true,
      show: false,
      data: [],
    }
  },
  beforeCreate() {
    this.$options.components.CommentReply = require('@/components/v2/comment/comment-reply.vue').default
  },
  components: {
    CommentReply: () => import('@/components/v2/comment/comment-reply.vue'),
    LoadMoreDiv
  },
  computed: {},
  methods: {
    ...mapActions("Comments", ['illustsReplies', 'novelsReplies']),
    request({worksType, commentId, page, force}) {
      if (worksType === 'illusts') {
        return this.illustsReplies({
          force, commentId, page
        })
      }
      if (worksType === 'novels') {
        return this.novelsReplies({
          force, commentId, page
        })
      }
    },
    success({comments, hasNext}) {
      this.hasNext = hasNext
      console.log(comments)
      this.data = comments;
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    //根评论id
    commentId: {type: Number, required: true},
    //类型 只能为 illusts 或 novels
    worksType: {type: String, required: true},
    //作品id
    workId: {type: Number, required: true,},
    //作者uid
    authorUserId: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>