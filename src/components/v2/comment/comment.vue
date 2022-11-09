<template>
  <div style="margin-bottom: 5px">
    {{ data }}
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
      <div v-if="isRoot && data.hasReplies">
        <!--    todo 楼中楼-->

      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/v2/user/user-avatar";
import UserLink from "@/components/v2/user/user-link";

const name = "评论"

export default {
  name: "comment",
  data() {
    return {
      showRelies: false,
    }
  },
  components: {UserLink, UserAvatar},
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
  },
}

</script>

<style scoped>

</style>