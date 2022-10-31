<template>
  <el-icon v-if="loading" :size="iconSize" class="is-loading" color="white">
    <Loading />
  </el-icon>
  <el-tooltip v-else :disabled="loading">
    <template #content>
      <div style="width: 550px">
        <el-image v-for="id in stampId" :src="`https://s.pximg.net/common/images/stamp/generated-stamps/${id}_s.jpg`"
                  style="width: 50px;cursor: pointer;margin-right: 5px"
                  @click="comment(id)"
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
import {mapActions, mapGetters} from "vuex";
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
    ...mapGetters("Illust", ['getIllust']),
    ...mapActions("IllustComment", ['commentStamp']),
    comment(stampId) {
      this.loading = true;
      this.commentStamp({
        illustId: this.pid,
        parentId: this.parentId,
        stampId,
        authorUserId: this.authorUserId,
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
      this.authorUserId = this.getIllust()(pid).userId;
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
    pid: {type: Number, required: true},
    parentId: {type: Number},
    replyToUserId: {type: Number},
    iconSize: {type: Number, default: 20},
  },
}

</script>

<style scoped>

</style>