<template>
  <div style="margin-bottom: 5px">
    <!--  用户和日期信息-->
    <div>
      <user-avatar :uid="data.uid" />
      <user-link :uid="data.uid" />
      <span style="color: rgba(240,248,255,0.65)"> @ {{ data.commentDate }}</span>
      <span v-if="data.replyToUserId">
        回复
        <user-link :uid="data.replyToUserId" />
      </span>
      :
      <!--      todo 删除评论按钮-->
      <!--      todo 回复楼中楼 按钮 表情贴图 或 文字回复-->
    </div>
    <!--正文和楼中楼    -->
    <div style="margin-left: 40px">
      <!--    正文-->
      <div>
        <span v-if="data.comment" v-html="data.comment"></span>
        <el-image v-else :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${data.stampId}_s.jpg`" style="width: 50px" />
      </div>
      <!--     楼中楼-->
      <div v-if="isRoot && data.hasReplies">
        <comment-replies-area :comment-id="data.id" :work-id="workId" :works-type="worksType" />
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";
import CommentRepliesArea from "@/components/v2/comment/comment-replies-area";

const name = "评论"

export default {
  name: "comment-reply",
  data() {
    return {
      showRelies: false,
    }
  },
  components: {CommentRepliesArea, UserLink, UserAvatar},
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    //评论数据
    data: {type: Object, required: true},
    //类型 只能为 illusts 或 novels
    worksType: {type: String, required: true},
    //作品id
    workId: {type: Number, required: true,},
    //是否为根评论
    isRoot: {type: Boolean, default: false,},
    //父评论id
    parentId: {type: Number},
  },
}

</script>

<style scoped>

</style>