<template>
  <el-icon v-if="loading" :size="iconSize" class="is-loading" color="white">
    <Loading />
  </el-icon>
  <el-icon v-else :size="iconSize" color="white" style="cursor: pointer" @click="del">
    <Delete />
  </el-icon>
</template>

<script>
import {Delete, Loading} from "@element-plus/icons-vue";
import {mapActions} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "comment-del",
  components: {Delete, Loading},
  emits: ['deleted'],
  data() {
    return {
      loading: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions("IllustComment", ['delComment']),
    del() {
      ElMessageBox.confirm("删除评论?", "确认删除").then(() => {
        this.loading = true;
        this.delComment({pid: this.pid, commentId: this.commentId,}).then(() => {
          ElMessage.success("删除成功");
          this.$emit('deleted', this.commentId)
        }).catch(e => {
          ElMessage.error("删除失败,请重试");
          console.error(e)
        }).finally(() => {
          this.loading = false;
        })
      }).catch(e => {
        if (e === 'cancel') {
          ElMessage.info("已取消")
        } else {
          console.error(e)
        }
      })
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    pid: {type: Number, required: true},
    commentId: {type: Number, required: true},
    iconSize: {type: Number, default: 20},
  },
}

</script>

<style scoped>

</style>