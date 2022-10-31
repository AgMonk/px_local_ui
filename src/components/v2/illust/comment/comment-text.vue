<template>
  <el-icon v-if="loading" :size="iconSize" class="is-loading" color="white">
    <Loading />
  </el-icon>
  <div v-else style="display:inline-block;">
    <el-icon :size="iconSize" color="white" style="cursor: pointer" @click="openDialog">
      <ChatDotSquare />
    </el-icon>

    <el-dialog v-model="showDialog" append-to-body close-on-click-modal title="回复">
      <div>
        <el-tooltip :disabled="disableTooltip">
          <template #content>
            <div style="width: 550px">
              <el-image v-for="(id,key) in emoji" :src="`https://s.pximg.net/common/images/emoji/${id}.png`"
                        style="width: 50px;cursor: pointer;margin-right: 5px"
                        @click="addEmoji(key)"
              />
            </div>
          </template>
          <el-icon :size="40" color="white" style="cursor: pointer">
            <Grid />
          </el-icon>
        </el-tooltip>
      </div>
      <el-input :id="'textArea_'+parentId" ref="textArea" v-model="text" minlength="3" placeholder="请输入评论内容" type="textarea" />

      <el-button :disabled="loading" :type="loading?'info':'success'" @click="submit">
        {{ loading ? '提交中..' : '提交' }}
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import {ChatDotSquare, Grid, Loading} from "@element-plus/icons-vue";
import {mapActions, mapGetters} from "vuex";
import {emoji} from "@/assets/v2/emoji";
import {TextAreaUtils} from "gin-utils/dist/utils/DomUtils";
import {ElMessage} from "element-plus";

export default {
  name: "comment-text",
  components: {ChatDotSquare, Loading, Grid},
  emits: ['success'],
  data() {
    return {
      emoji,
      text: "",
      loading: false,
      disableTooltip: false,
      authorUserId: undefined,
      showDialog: false,
    }
  },
  computed: {},
  methods: {
    ...mapGetters("Illust", ['getIllust']),
    ...mapActions("IllustComment", ['commentText']),
    submit() {
      this.loading = true;
      this.commentText({
        parentId: this.parentId,
        authorUserId: this.authorUserId,
        illustId: this.pid,
        text: this.text,
      }).then(res => {
        if (this.replyToUserId) {
          res.replyToUserId = this.replyToUserId;
        }
        this.showDialog = false;
        this.$emit("success", res)
      }).catch(e => {
        ElMessage.error("评论失败,请重试")
        console.error(e)
      }).finally(() => {
        this.loading = false;
      })
    },
    addEmoji(key) {
      let textarea = document.getElementById('textArea_' + this.parentId);
      TextAreaUtils.insertText(textarea, {
        sourceText: this.text,
        prefix: `(${key})`,
        callback: (result, position) => {
          this.text = result
          this.disableTooltip = true;
          console.log(position)
          setTimeout(() => {
            this.disableTooltip = false;
          }, 500)
        }
      })
    },
    openDialog() {
      this.showDialog = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.textArea.focus()
          this.$refs.textArea.select()
        }, 50)
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