<template>
  <el-icon v-if="loading" :size="iconSize" class="is-loading" color="white">
    <Loading />
  </el-icon>
  <el-tooltip v-else :disabled="loading">
    <template #content>
      <div style="width: 550px">
        <el-image v-for="id in stampId" :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${id}_s.jpg`"
                  style="width: 50px;cursor: pointer;margin-right: 5px"
                  @click="request(id)"
        />
      </div>
    </template>
    <el-icon :size="iconSize" color="white" style="cursor: pointer">
      <Grid />
    </el-icon>
  </el-tooltip>
</template>

<script>
import {Grid, Loading} from "@element-plus/icons-vue";
import {mapActions} from "vuex";
import {stampId} from "@/assets/v2/stampId";
import {ElMessage} from "element-plus";

export default {
  name: "comment-stamp",
  components: {Grid, Loading},
  emits: ['success'],
  data() {
    return {
      stampId,
      loading: false,
      authorUserId: undefined,
    }
  },
  computed: {},
  methods: {
    ...mapActions("Comments", ['comment']),
    request(stampId) {
      this.loading = true;
      this.comment({
        stampId,
        worksType: this.worksType,
        parentId: this.parentId,
        id: this.id,
        authorUserId: this.authorUserId,
        type: 'stamp',
      }).then(res => {
        if (this.replyToUserId) {
          res.replyToUserId = this.replyToUserId;
        }
        this.$emit("success", res)
      }).catch(e => {
        ElMessage.error("评论失败,请重试")
        console.error(e)
      }).finally(() => {
        this.loading = false;
      })
    },
    load(pid, force) {
    }
  },
  mounted() {
    this.load(this.pid)
  },
  watch: {
    pid(to) {
      this.load(to)
    }
  },
  props: {
    //作品id
    id: {type: Number, required: true},
    //类型 只能为 illusts 或 novels
    worksType: {type: String, required: true},
    //作者uid
    authorUserId: {type: Number, required: true},
    //如果是楼中楼，根评论id
    parentId: {type: Number},
    //被回复的用户uid
    replyToUserId: {type: Number},
    iconSize: {type: Number, default: 20},
  },
}

</script>

<style scoped>

</style>