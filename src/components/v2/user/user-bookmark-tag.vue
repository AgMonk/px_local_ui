<template>
  <retry-div :min-height="60" :params="params" :request="request" unmount-while-loading @failed="failed" @success="success">
    <!--    <el-select v-model="tag" :clearable="true" :filterable="true" placeholder="请输入关键字" @change="$emit('change',$event)">-->
    <!--      <el-option v-for="item in options[rest]" :label="`${item.tag}(${item.cnt})`" :value="item.tag" />-->
    <!--    </el-select>-->
    <el-autocomplete v-model="tag"
                     :fetch-suggestions="querySearch"
                     placeholder="请输入标签名关键字"
                     style="min-width: 200px"
                     @select="handleSelect"
    />
    <el-button type="danger" @click="clear">清空</el-button>
  </retry-div>
</template>

<script>
import {mapActions} from "vuex";
import {ElMessage} from "element-plus";

const name = "用户收藏中的标签"
const untagged = "未分類"

export default {
  name: "user-bookmark-tag",
  emits: ['change'],
  data() {
    return {
      tag: this.value,
      options: {
        show: [],
        hide: [],
      },
      option: [],
      params: {
        uid: this.uid,
        type: this.type,
        force: false,
      },

    }
  },
  components: {},
  computed: {},
  methods: {
    ...mapActions("Bookmarks", ["illustTag", "novelTag"]),
    clear() {
      this.tag = undefined
      this.$emit('change')
    },
    handleSelect(e) {
      this.tag = e.tag
      this.$emit('change', e.tag)
    },
    querySearch(s, callback) {
      const array = this.options[this.rest]
      const data = s ? array.filter(i => i.tag.includes(s)) : array.slice(0, 10)
      callback(data.map(({tag, cnt}) => {
        return {value: `${tag}(${cnt})`, tag}
      }))
    },
    //失败回调
    failed(e) {
      ElMessage.error(e.message)
    },
    success(e) {
      this.options = e
    },
    request({type, uid, force}) {
      const method = type === 'illust' ? this.illustTag : this.novelTag;
      return method({uid, force})
    },
    load(type, uid, force) {
      this.params = {type, uid, force}
    }
  },
  mounted() {
  },
  watch: {
    uid(uid) {
      this.load(this.type, uid)
    },
    type(type) {
      this.load(type, this.uid)
    },
    value(to) {
      this.tag = to
    },
  },
  props: {
    uid: {type: Number, required: true,},
    type: {type: String, required: true,},
    //初值
    value: {},
    rest: {type: String, required: true,},
  },
}

</script>

<style scoped>

</style>