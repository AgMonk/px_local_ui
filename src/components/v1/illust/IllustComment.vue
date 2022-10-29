<template>
  <div style="margin-left: 20px;margin-top: 5px">
    <user-avatar :size="30" :uid="comment.author.id" />
    <user-link :size="15" :uid="comment.author.id" />
    <span class="common-text" style="margin-left: 5px">@ {{ comment.comment.timestamp }}</span>
    <div v-if="comment.comment.content" class="common-text">
      {{ comment.comment.content }}
    </div>
    <div v-else>
      <el-image :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${comment.comment.stampId}_s.jpg`" />
    </div>
    <div v-if="comment.comment.hasReplies" class="common-text">
      <el-button v-if="hasNext" size="small" @click="loadReplies">查看回复</el-button>
      <div v-for="row in replies" style="text-align: left">
        <illust-comment :comment="row" />
      </div>
    </div>
  </div>

</template>

<script>
import {getRepliesOfComment} from "@/assets/js/request/comment";
import {mapMutations} from "vuex";
import UserAvatar from "@/components/v1/user/UserAvatar";
import UserLink from "@/components/v1/user/UserLink";

export default {
  name: "IllustComment",
  components: {UserLink, UserAvatar},
  data() {
    return {
      replies: [],
      page: 1,
      hasNext: true,
    }
  },
  computed: {},
  methods: {
    ...mapMutations("User", [`saveInfo2Cache`]),
    loadReplies() {
      getRepliesOfComment({cid: this.comment.comment.id, page: this.page}).then(res => {
        const {comments, hasNext} = res
        this.hasNext = hasNext;
        this.replies.push(...comments)
        for (let i = 0; i < comments.length; i++) {
          this.saveInfo2Cache(comments[i].author)
        }
      })
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    comment: {}
  },
}

</script>

<style scoped>

</style>