<template>
  <div style="background-color: rgba(1,48,133,0.3);color: white;text-align: left;margin-top: 20px">
    <h2>评论区
      <el-switch
          v-model="show"
          class="ml-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      />
        <!--      发表评论按钮-->
      <comment-stamp :id="id" :author-user-id="authorUserId" :works-type="worksType" @success="commentSuccess" />
      <comment-text :id="id" :author-user-id="authorUserId" :works-type="worksType" @success="commentSuccess" />
    </h2>
    <load-more-div v-if="show" :has-next="hasNext" :init-request="request" :load-more-request="request" :params="params" @success="success">
      <!--        评论显示-->
      <comment-reply v-for="item in data" :author-user-id="authorUserId" :data="item" :work-id="id" :works-type="worksType" is-root @deleted="deleted" />
    </load-more-div>
  </div>
</template>

<script>
import LoadMoreDiv from "@/components/v2/load-more-div";
import {mapActions} from "vuex";
import CommentReply from "@/components/v2/comment/comment-reply";
import CommentStamp from "@/components/v2/illust/comment/comment-stamp";
import CommentText from "@/components/v2/illust/comment/comment-text";

const name = "评论区"

export default {
  name: "comment-area",
  data() {
    return {
      params: {
        worksType: this.worksType,
        id: this.id,
        page: 1,
        force: false,
      },
      data: [],
      hasNext: true,
      show: false,
    }
  },
  components: {CommentText, CommentStamp, CommentReply, LoadMoreDiv},
  computed: {},
  methods: {
    ...mapActions("Comments", ['novelsRoots', 'illustsRoots']),
    deleted(e) {
      this.data = this.data.filter(i => i.id !== e)
    },
    commentSuccess(e) {
      // 评论成功
      this.data = [e, ...this.data];
    },
    success({comments, hasNext}) {
      this.hasNext = hasNext
      console.log(comments)
      this.data = comments;
    },
    request({worksType, id, page, force}) {
      if (worksType === 'illusts') {
        return this.illustsRoots({
          force, pid: id, page
        })
      }
      if (worksType === 'novels') {
        return this.novelsRoots({
          force, nid: id, page
        })
      }
    },
    load({worksType, id, page}, force) {
      this.params = {worksType, id, page, force}
    }
  },
  mounted() {
  },
  watch: {
    worksType(worksType) {
      this.load({worksType, id: this.id, page: 1}, false)
    },
    id(id) {
      this.load({worksType: this.worksType, id, page: 1}, false)
    },
  },
  props: {
    //类型 只能为 illusts 或 novels
    worksType: {type: String, required: true},
    //id 根据类型不同 为 pid 或 nid
    id: {type: Number, required: true},
    //作者uid
    authorUserId: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>