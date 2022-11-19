<template>
  <retry-div :min-height="40" :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
    <el-select v-model="value" :clearable="true" :filterable="true" @change="change">
      <el-option v-for="item in options" :value="item.tag">
        <div style="display: flex; justify-content: flex-start;">
          <span>{{ item.tag }}({{ item.cnt }})</span>
          <span style="margin-left: auto">{{ item.tag_translation }}</span>
        </div>
      </el-option>
    </el-select>
  </retry-div>
</template>

<script>
import {ElMessage} from "element-plus";
import {mapActions} from "vuex";

const name = "用户作品使用的标签"

export default {
  name: "user-work-tag",
  emits: ['use-tag'],
  data() {
    return {
      value: this.defaultValue,
      options: [],
      params: {
        type: this.type,
        uid: this.uid,
        force: false,
      },
    }
  },
  components: {},
  computed: {},
  methods: {
    ...mapActions("User", ['illustTags', 'mangaTags', 'novelTags']),
    //请求
    change(e) {
      this.$emit('use-tag', e);
    },
    request({type, uid, force}) {
      let method;
      switch (type) {
        case 'illust':
          method = this.illustTags;
          break
        case 'novel':
          method = this.novelTags;
          break
        case 'manga':
          method = this.mangaTags;
          break
      }
      return method({uid, force})
    },
    //成功回调
    success(res) {
      this.options = res.sort((a, b) => {
        if (a.cnt !== b.cnt) {
          return b.cnt - a.cnt
        }
        if (a.tag_translation && !b.tag_translation) {
          return -1
        }
        if (b.tag_translation && !a.tag_translation) {
          return 1
        }
        return a.tag.localeCompare(b.tag)
      })
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    load(type, force) {
      this.params = {type, uid: this.uid, force}
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    type: {type: String, required: true},
    defaultValue: {type: String},
    uid: {type: Number, required: true},
  },
}

</script>

<style scoped>

</style>